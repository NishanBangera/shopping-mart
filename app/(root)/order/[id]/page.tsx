import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const shippingAddress = order.shippingAddress as ShippingAddress;
  const session = await auth();

  let client_secret = null;

  // Check if it is not paid or payment method is stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Initialize stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    // Create a payment intent with required customer details for India
    const customer = await stripe.customers.create({
      name: order.user.name,
      address: {
        line1: shippingAddress.streetAddress,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country: "IN",
      },
    });

    // Then create the payment intent with the customer ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "inr",
      description: "testing",
      payment_method_types: ["card"],
      customer: customer.id,
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin" || false}
    />
  );
};

export default OrderDetailsPage;
