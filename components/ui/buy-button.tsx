"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

type Props = {
  projectId: string;
  amount: number;
  title: string;
};

const loadRazorpay = async () => {
  if (document.getElementById("razorpay-sdk")) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const BuyButton = ({ projectId, amount, title }: Props) => {
  const { user, getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onBuy = async () => {
    if (!user) {
      setMessage("Please login before purchasing.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) throw new Error("Unable to load payment SDK");

      const token = await getIdToken();
      if (!token) throw new Error("Authentication failed");

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }),
      });

      if (!orderRes.ok) throw new Error("Unable to create order");
      const order = await orderRes.json();

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Student Project Marketplace",
        description: `Purchase: ${title}`,
        order_id: order.id,
        handler: async (response: Record<string, string>) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...response,
              projectId,
            }),
          });

          const verify = await verifyRes.json();
          if (!verifyRes.ok) {
            setMessage(verify.error || "Payment verification failed");
            return;
          }

          setMessage("Payment successful. Check your email for the download link.");
        },
        prefill: {
          email: user.email || "",
          name: user.displayName || "",
        },
        theme: { color: "#111111" },
      });

      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onBuy}
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
      >
        {loading ? "Processing..." : `Buy for ₹${amount}`}
      </button>
      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </div>
  );
};
