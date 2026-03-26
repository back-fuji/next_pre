import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // 署名を検証して改ざんを防ぐ（セキュリティ上の重要ポイント）
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook 署名検証エラー:", err);
    return NextResponse.json({ error: "署名検証失敗" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const workspaceId = session.metadata?.workspaceId;

        if (workspaceId) {
          await db.workspace.update({
            where: { id: workspaceId },
            data: { plan: "PRO" },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const workspaceId = subscription.metadata?.workspaceId;

        if (workspaceId) {
          await db.workspace.update({
            where: { id: workspaceId },
            data: { plan: "FREE" },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook 処理エラー:", err);
    return NextResponse.json({ error: "Webhook 処理失敗" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
