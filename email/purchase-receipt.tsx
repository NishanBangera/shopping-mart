import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";
import sampleData from "@/db/sample-data";

require('dotenv').config()

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: "123",
    user: {
      name: "Simon Sinek",
      email: "simon@test.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      fullName: "Simon Sinek",
      streetAddress: "123 Main st",
      city: "Mumbai",
      postalCode: "574022",
      country: "India",
    },
    createdAt: new Date(),
    totalPrice: 1000,
    taxPrice: 100,
    shippingPrice: 110,
    itemsPrice: 790,
    orderitem: sampleData.products.map((x) => ({
      name: x.name,
      orderId: crypto.randomUUID(),
      productId: crypto.randomUUID(),
      slug: x.slug,
      qty: x.stock,
      image: x.images[0],
      price: x.price,
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: crypto.randomUUID(),
      status: "succeeded",
      pricePaid: "1100",
      email_address: "simon@test.com",
    },
  },
} satisfies OrderInformationProps

type OrderInformationProps = {
    order: Order
}

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  const priceReceipt = [
    { name: "Items", price: order.itemsPrice },
    { name: "Tax", price: order.taxPrice },
    { name: "Shipping", price: order.shippingPrice },
    { name: "Total", price: order.totalPrice },
  ];
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4">
                    ₹{formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.orderitem.map((item) => (
                <Row key={item.productId} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    {item.name} x {item.qty}
                  </Column>
                  <Column align="right" className="align-top">
                    ₹{formatCurrency(item.price)}
                  </Column>
                </Row>
              ))}
              {priceReceipt.map(({ name, price }) => (
                <Row key={name}>
                  <Column align="right">{name}:</Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">₹{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
