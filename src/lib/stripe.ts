import Stripe from "stripe";

// Stripe クライアントのシングルトン
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});
