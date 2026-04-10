import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/auth";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [ordersSnapshot, requestsSnapshot] = await Promise.all([
      getAdminDb().collection("orders").orderBy("createdAt", "desc").get(),
      getAdminDb().collection("customRequests").orderBy("createdAt", "desc").get(),
    ]);

    const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const requests = requestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ orders, requests });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load dashboard" },
      { status: 500 },
    );
  }
}
