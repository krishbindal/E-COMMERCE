"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import type { MarketplaceOrder } from "@/lib/types";

export default function OrdersPage() {
  const { user, loading, getIdToken } = useAuth();
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const run = async () => {
      try {
        const token = await getIdToken();
        if (!token) return;

        const response = await fetch("/api/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load orders");
        setOrders(data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load orders");
      }
    };

    run();
  }, [user, loading, getIdToken, router]);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
      {error && <p className="mb-4 text-red-300">{error}</p>}
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded border border-white/10 bg-zinc-950 p-4 text-sm">
            <p>Project ID: {order.projectId}</p>
            <p>Payment ID: {order.paymentId}</p>
            <p>Status: {order.status}</p>
            <p>Created: {order.createdAt}</p>
          </div>
        ))}
      </div>
      {orders.length === 0 && !error && <p className="text-zinc-300">No orders yet.</p>}
    </section>
  );
}
