import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

/**
 * Stripe Webhook endpoint
 * Handle payment success events, update user role and subscription status
 * Configure this endpoint in Stripe Dashboard and set the signing secret
 */
export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  const supabase = createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      const isSubscription = session.mode === "subscription";
      const role = isSubscription ? "pro" : "lifetime";

      // Update user role
      await supabase
        .from("profiles")
        .update({
          role,
          daily_limit: 500,
          max_files_per_request: 50,
        })
        .eq("id", userId);

      // Update subscription record
      if (isSubscription && session.subscription) {
        const sub = await getStripe().subscriptions.retrieve(session.subscription as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subData = sub as any;
        await supabase
          .from("subscriptions")
          .update({
            stripe_subscription_id: session.subscription as string,
            status: subData.status,
            current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
          })
          .eq("user_id", userId);
      }

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (sub?.user_id) {
        await supabase
          .from("profiles")
          .update({ role: "free", daily_limit: 5, max_files_per_request: 2 })
          .eq("id", sub.user_id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (sub?.user_id) {
        await supabase
          .from("profiles")
          .update({ role: "free", daily_limit: 5, max_files_per_request: 2 })
          .eq("id", sub.user_id);
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
