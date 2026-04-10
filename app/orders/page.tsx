"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast-provider";
import type { MarketplaceOrder } from "@/lib/types";

export default function OrdersPage() {
  const { user, loading, getIdToken } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
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
        const text = err instanceof Error ? err.message : "Unable to load orders";
        setError(text);
        showToast(text, "error");
      } finally {
        setFetching(false);
      }
    };

    run();
  }, [user, loading, getIdToken, router, showToast]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">My Orders</h1>
        <p className="mt-2 text-zinc-400">Track payment history and purchase status.</p>
      </div>

      {error && <p className="rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

      {fetching ? (
        <div className="grid gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : orders.length === 0 && !error ? (
        <EmptyState title="No orders yet" description="Projects you purchase will appear here instantly." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="glass-card p-4 text-sm">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <p>
                  <span className="text-zinc-400">Project ID:</span> {order.projectId}
                </p>
                <p>
                  <span className="text-zinc-400">Payment ID:</span> {order.paymentId}
                </p>
                <p>
                  <span className="text-zinc-400">Status:</span> {order.status}
                </p>
                <p>
                  <span className="text-zinc-400">Created:</span> {order.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
