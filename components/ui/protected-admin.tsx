"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!allowedEmail || user.email !== allowedEmail) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="p-6 text-zinc-300">Checking access...</p>;
  }

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null;
  }

  return <>{children}</>;
};
