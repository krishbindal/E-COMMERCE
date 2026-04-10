import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/auth";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    let ordersSnapshot;
    let requestsSnapshot;

    try {
      [ordersSnapshot, requestsSnapshot] = await Promise.all([
        db.collection("orders").orderBy("createdAt", "desc").get(),
        db.collection("customRequests").orderBy("createdAt", "desc").get(),
      ]);
    } catch {
      [ordersSnapshot, requestsSnapshot] = await Promise.all([
        db.collection("orders").get(),
        db.collection("customRequests").get(),
      ]);
    }

    const orders = ordersSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTime = new Date(String((a as { createdAt?: string }).createdAt || 0)).getTime();
        const bTime = new Date(String((b as { createdAt?: string }).createdAt || 0)).getTime();
        return bTime - aTime;
      });
    const requests = requestsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTime = new Date(String((a as { createdAt?: string }).createdAt || 0)).getTime();
        const bTime = new Date(String((b as { createdAt?: string }).createdAt || 0)).getTime();
        return bTime - aTime;
      });

    return NextResponse.json({ orders, requests });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load dashboard" },
      { status: 500 },
    );
  }
}
