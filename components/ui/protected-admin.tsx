"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    if (allowedEmail && user.email !== allowedEmail) {
      router.push("/");
    }
  }, [user, loading, router, allowedEmail]);

  if (loading) {
    return <p className="p-6 text-zinc-300">Checking access...</p>;
  }

  if (!user || (allowedEmail && user.email !== allowedEmail)) {
    return null;
  }

  return <>{children}</>;
};
