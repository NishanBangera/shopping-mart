"use server";

import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

//Check whether user purchased the product to review
export async function checkUserPurchase(userId: string, productId: string) {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      orderitem: {
        select: {
          productId: true,
        },
      },
    },
  });
  for (const order of orders){
    if(order.isDelivered){
    const foundProduct = order.orderitem.find(item => item.productId === productId)
    if(foundProduct) return true
    }
  }
  return null
}

// Create or update reviews
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    // Validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error("Product not found");

    // Check if user already reviewed
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        // Update Review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        // Create Review
        await tx.review.create({ data: review });
      }

      // Fetch avg rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      // Fetch number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      // Update the rating and numReviews in product table
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review Updated Successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { data };
}

// Get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();

  if (!session) throw new Error("User is not authenticated");

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session?.user?.id,
    },
  });
}
