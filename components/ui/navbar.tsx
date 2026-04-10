"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/request", label: "Custom Request" },
  { href: "/orders", label: "My Orders" },
  { href: "/dashboard", label: "Dashboard" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight sm:text-lg">
          <span className="gradient-text">Student Marketplace</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-2 text-xs sm:text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                    : "border border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <button
              onClick={() => logout()}
              className="rounded-lg border border-white/20 bg-white/[0.03] px-3 py-2 text-zinc-200 transition hover:bg-white/12"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-lg border border-white/20 bg-white/[0.03] px-3 py-2 text-zinc-200 hover:bg-white/12">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
