import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSchema } from "@/utils/validation";
import { getUserFromRequest } from "@/utils/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { getProjectById } from "@/lib/sanity";
import { getResend } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = verifyPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, projectId } = parsed.data;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "Razorpay secret is missing" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await getAdminDb().collection("orders").add({
      userId: user.uid,
      email: user.email,
      projectId,
      paymentId: razorpay_payment_id,
      status: "paid",
      createdAt: new Date().toISOString(),
    });

    const project = await getProjectById(projectId);
    if (project) {
      const fromEmail = process.env.FROM_EMAIL;
      const adminEmail = process.env.ADMIN_EMAIL;

      if (fromEmail && adminEmail) {
        try {
          const resend = getResend();

          await resend.emails.send({
            from: fromEmail,
            to: user.email,
            subject: `Your project download: ${project.title}`,
            html: `<p>Payment successful for <strong>${project.title}</strong>.</p><p>Download link: <a href="${project.fileUrl}">${project.fileUrl}</a></p>`,
          });

          await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: `New order received - ${project.title}`,
            html: `<p>${user.email} purchased ${project.title}.</p><p>Payment ID: ${razorpay_payment_id}</p>`,
          });
        } catch (emailError) {
          console.error("Failed to send order emails", emailError);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment verification failed" },
      { status: 500 },
    );
  }
}
