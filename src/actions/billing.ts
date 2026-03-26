"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

/**
 * Stripe Checkout セッションを作成してリダイレクトする
 * テストモードのカード番号: 4242 4242 4242 4242
 */
export async function createCheckoutSession(workspaceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== session.user.id) {
    return { error: "権限がありません" };
  }

  // Stripe Customer を作成または取得
  let customerId = workspace.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      metadata: { workspaceId, userId: session.user.id },
    });

    customerId = customer.id;

    await db.workspace.update({
      where: { id: workspaceId },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    metadata: { workspaceId },
    subscription_data: {
      // Subscription オブジェクトにも保持（解約イベント用）
      metadata: { workspaceId },
    },
  });

  redirect(checkoutSession.url!);
}

/**
 * Stripe Customer Portal にリダイレクトする（解約・変更用）
 */
export async function createPortalSession(workspaceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace?.stripeCustomerId) {
    return { error: "Stripe Customer が見つかりません" };
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: workspace.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  redirect(portalSession.url);
}
