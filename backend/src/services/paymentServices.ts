import Stripe from "stripe";
import "dotenv/config";
import { ProductForSessionInput } from "src/resolvers/PaymentResolver";

interface LineItemI {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

let baseUrl = process.env.BASE_URL_DEV;

if (process.env.APP_ENV === "staging") {
  baseUrl = process.env.BASE_URL_STAGING;
}

if (process.env.APP_ENV === "production") {
  baseUrl = process.env.BASE_URL_PRODUCTION;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

// 👉 Service de paiement
const paymentServices = {
  createLineItems: (products: ProductForSessionInput[]): LineItemI[] => {
    return products.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },

      quantity: item.quantity,
    }));
  },

  createCheckoutSession: async (products: ProductForSessionInput[]) => {
    const line_items = paymentServices.createLineItems(products);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/panier`,
    });

    return session;
  },
};

export default paymentServices;
