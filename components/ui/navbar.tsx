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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          Student Marketplace
        </Link>
        <nav className="flex items-center gap-3 text-sm text-zinc-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 transition ${
                pathname === link.href ? "bg-white text-black" : "hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => logout()}
              className="rounded-md border border-white/20 px-3 py-2 hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-md border border-white/20 px-3 py-2 hover:bg-white/10">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
