import { NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/utils/validation";
import { getUserFromRequest } from "@/utils/auth";
import { getProjectById } from "@/lib/sanity";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const project = await getProjectById(parsed.data.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const price = Number(project.price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid project price" }, { status: 400 });
    }

    const amount = Math.round(price * 100);
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `project_${project._id}_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order" },
      { status: 500 },
    );
  }
}
