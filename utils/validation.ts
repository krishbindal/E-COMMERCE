import { z } from "zod";

export const createOrderSchema = z.object({
  projectId: z.string().min(1),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  projectId: z.string().min(1),
});

export const customRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  description: z.string().min(10),
  budget: z.string().min(1),
  deadline: z.string().min(1),
});
