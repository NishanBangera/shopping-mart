export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 4