import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/auth";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    let snapshot;

    try {
      snapshot = await db
        .collection("orders")
        .where("userId", "==", user.uid)
        .orderBy("createdAt", "desc")
        .get();
    } catch {
      snapshot = await db.collection("orders").where("userId", "==", user.uid).get();
    }

    const orders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTime = new Date(String((a as { createdAt?: string }).createdAt || 0)).getTime();
        const bTime = new Date(String((b as { createdAt?: string }).createdAt || 0)).getTime();
        return bTime - aTime;
      });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch orders" },
      { status: 500 },
    );
  }
}
