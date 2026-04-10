"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { ProtectedAdmin } from "@/components/ui/protected-admin";
import type { CustomRequest, MarketplaceOrder } from "@/lib/types";

type DashboardResponse = {
  orders: MarketplaceOrder[];
  requests: CustomRequest[];
};

export default function DashboardPage() {
  const { getIdToken } = useAuth();
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
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    };

    run();
  }, [getIdToken]);

  return (
    <ProtectedAdmin>
      <section className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {error && <p className="text-sm text-red-300">{error}</p>}
        {!data ? (
          <p className="text-zinc-300">Loading dashboard...</p>
        ) : (
          <>
            <div>
              <h2 className="mb-3 text-xl font-semibold">Orders</h2>
              <div className="space-y-3">
                {data.orders.map((order) => (
                  <div key={order.id} className="rounded border border-white/10 bg-zinc-950 p-4 text-sm">
                    <p>User: {order.email}</p>
                    <p>Project: {order.projectId}</p>
                    <p>Payment: {order.paymentId}</p>
                    <p>Status: {order.status}</p>
                    <p>Created: {order.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold">Custom Requests</h2>
              <div className="space-y-3">
                {data.requests.map((request) => (
                  <div key={request.id} className="rounded border border-white/10 bg-zinc-950 p-4 text-sm">
                    <p>Name: {request.name}</p>
                    <p>Email: {request.email}</p>
                    <p>Phone: {request.phone}</p>
                    <p>Budget: {request.budget}</p>
                    <p>Deadline: {request.deadline}</p>
                    <p>Description: {request.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </ProtectedAdmin>
  );
}
