"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/ui/toast-provider";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const { showToast } = useToast();
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
      showToast(isSignUp ? "Account created successfully." : "Logged in successfully.", "success");
      router.push("/projects");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Authentication failed";
      setMessage(text);
      showToast(text, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <h1 className="text-2xl font-semibold">{isSignUp ? "Create account" : "Login"}</h1>
      <form onSubmit={handleEmailAuth} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="input-luxury" />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          className="input-luxury"
        />
        <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Please wait..." : isSignUp ? "Sign up" : "Login"}
        </button>
      </form>
      <button
        type="button"
        onClick={async () => {
          try {
            await loginWithGoogle();
            showToast("Logged in with Google.", "success");
            router.push("/projects");
          } catch (error) {
            const text = error instanceof Error ? error.message : "Google login failed";
            setMessage(text);
            showToast(text, "error");
          }
        }}
        className="btn-secondary w-full"
      >
        Continue with Google
      </button>
      <button type="button" onClick={() => setIsSignUp((prev) => !prev)} className="text-sm text-zinc-300 underline">
        {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
      </button>
      {message && <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">{message}</p>}
    </section>
  );
}
