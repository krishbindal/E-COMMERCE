import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Navbar } from "@/components/ui/navbar";
import { ToastProvider } from "@/components/ui/toast-provider";

export const metadata: Metadata = {
  title: "Student Project Marketplace",
  description: "Buy production-ready student projects instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <div className="relative min-h-screen overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_35%)]" />
              <div className="relative z-10">
                <Navbar />
                <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                  {children}
                </main>
              </div>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
