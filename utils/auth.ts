import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export const getUserFromRequest = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    return null;
  }
};
