"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { ProtectedAdmin } from "@/components/ui/protected-admin";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast-provider";
import type { CustomRequest, MarketplaceOrder } from "@/lib/types";

type DashboardResponse = {
  orders: MarketplaceOrder[];
  requests: CustomRequest[];
};

export default function DashboardPage() {
  const { getIdToken } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const token = await getIdToken();
        if (!token) return;

        const response = await fetch("/api/admin-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "Failed to fetch dashboard data");
        }

        setData(json);
      } catch (err) {
        const text = err instanceof Error ? err.message : "Something went wrong";
        setError(text);
        showToast(text, "error");
      }
    };

    run();
  }, [getIdToken, showToast]);

  return (
    <ProtectedAdmin>
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-zinc-400">Track orders and custom requests with a clean operational view.</p>
        </div>

        {error && <p className="rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

        {!data ? (
          <div className="grid gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <div className="glass-card overflow-hidden">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="text-lg font-semibold">Orders</h2>
              </div>
              {data.orders.length === 0 ? (
                <div className="p-6">
                  <EmptyState title="No orders yet" description="Incoming purchases will appear here automatically." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Payment</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((order) => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                          <td className="px-4 py-3">{order.email}</td>
                          <td className="px-4 py-3">{order.projectId}</td>
                          <td className="px-4 py-3">{order.paymentId}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-100">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400">{order.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="glass-card overflow-hidden">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="text-lg font-semibold">Custom Requests</h2>
              </div>
              {data.requests.length === 0 ? (
                <div className="p-6">
                  <EmptyState title="No custom requests" description="New submitted requests will be listed here." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Budget</th>
                        <th className="px-4 py-3">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.requests.map((request) => (
                        <tr key={request.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                          <td className="px-4 py-3">{request.name}</td>
                          <td className="px-4 py-3">{request.email}</td>
                          <td className="px-4 py-3">{request.phone}</td>
                          <td className="px-4 py-3">{request.budget}</td>
                          <td className="px-4 py-3">{request.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </ProtectedAdmin>
  );
}
