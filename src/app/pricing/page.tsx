"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";


const plans = [
  {
    name: "Free",
    price: "¥0",
    period: "/mo",
    description: "For occasional personal use",
    features: ["Max 2 files per request", "5 daily processing quota", "Basic tool access", "Community support"],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro Monthly",
    price: "$9.99",
    period: "/mo",
    description: "For daily professional use",
    features: ["Max 50 files per request", "500 daily processing quota", "Unlimited tool access", "Priority support", "Early feature access"],
    cta: "Subscribe Now",
    priceId: "price_pro_monthly",
    mode: "subscription" as const,
    highlighted: true,
  },
  {
    name: "Lifetime",
    price: "$29",
    period: "",
    description: "Pay once, use forever",
    features: ["Max 50 files per request", "500 daily processing quota", "Unlimited tool access", "Lifetime free updates", "Dedicated support"],
    cta: "Buy Lifetime",
    priceId: "price_lifetime",
    mode: "payment" as const,
    highlighted: false,
  },
];

export default function PricingPage() {
  const { user } = useStore();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: (typeof plans)[number]) => {
    if (!user) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }
    if (!plan.priceId) return;

    setLoading(plan.name);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, mode: plan.mode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch {
      alert("Network error, please try again");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Flexible pricing for every need
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.highlighted ? "border-primary shadow-lg scale-105" : ""
            }`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-muted-foreground">{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {plan.priceId ? (
                  <Button
                    className="w-full"
                    onClick={() => handleCheckout(plan)}
                    disabled={loading === plan.name}
                  >
                    {loading === plan.name ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      plan.cta
                    )}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={plan.href}>{plan.cta}</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
