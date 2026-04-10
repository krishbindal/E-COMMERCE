"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      if (isSignUp) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      router.push("/projects");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border border-white/10 bg-zinc-950 p-6">
      <h1 className="mb-4 text-2xl font-bold">{isSignUp ? "Create account" : "Login"}</h1>
      <form onSubmit={handleEmailAuth} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border border-white/20 bg-black px-3 py-2" />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          className="w-full rounded border border-white/20 bg-black px-3 py-2"
        />
        <button disabled={loading} className="w-full rounded bg-white px-4 py-2 font-semibold text-black hover:bg-zinc-200 disabled:opacity-60">
          {loading ? "Please wait..." : isSignUp ? "Sign up" : "Login"}
        </button>
      </form>
      <button
        onClick={async () => {
          try {
            await loginWithGoogle();
            router.push("/projects");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Google login failed");
          }
        }}
        className="mt-3 w-full rounded border border-white/20 px-4 py-2 hover:bg-white/10"
      >
        Continue with Google
      </button>
      <button onClick={() => setIsSignUp((prev) => !prev)} className="mt-3 text-sm text-zinc-300 underline">
        {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
      </button>
      {message && <p className="mt-3 text-sm text-zinc-300">{message}</p>}
    </section>
  );
}
