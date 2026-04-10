import { NextRequest, NextResponse } from "next/server";
import { customRequestSchema } from "@/utils/validation";
import { getAdminDb } from "@/lib/firebase-admin";
import { getResend } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = customRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const payload = {
      ...parsed.data,
      createdAt: new Date().toISOString(),
    };

    await getAdminDb().collection("customRequests").add(payload);

    const resend = getResend();
    const fromEmail = process.env.FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!fromEmail || !adminEmail) {
      throw new Error("Email environment variables missing");
    }

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New custom project request from ${payload.name}`,
      html: `<p>Email: ${payload.email}</p><p>Phone: ${payload.phone}</p><p>Budget: ${payload.budget}</p><p>Deadline: ${payload.deadline}</p><p>${payload.description}</p>`,
    });

    await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      subject: "We received your custom project request",
      html: `<p>Hi ${payload.name},</p><p>Your custom project request has been received. We will contact you soon.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit request" },
      { status: 500 },
    );
  }
}
