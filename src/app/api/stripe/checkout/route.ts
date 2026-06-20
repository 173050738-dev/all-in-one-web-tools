import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * Stripe Checkout Session creation endpoint
 * Receive priceId and mode from frontend, return Stripe Checkout URL
 * Requires user to be logged in
 */
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();
    const { priceId, mode } = body;

    if (!priceId || !mode) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Query or create Stripe Customer
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", session.user.id)
      .single();

    let customerId = sub?.stripe_customer_id;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: session.user.email,
        metadata: { user_id: session.user.id },
      });
      customerId = customer.id;
      await supabase.from("subscriptions").insert({
        user_id: session.user.id,
        stripe_customer_id: customerId,
      });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { user_id: session.user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
