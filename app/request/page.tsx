"use client";

import { FormEvent, useState } from "react";

export default function RequestPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      description: formData.get("description"),
      budget: formData.get("budget"),
      deadline: formData.get("deadline"),
    };

    try {
      const response = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setMessage("Request submitted successfully. We have emailed you confirmation.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-zinc-950 p-6">
      <h1 className="mb-6 text-2xl font-bold">Request a Custom Project</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="name" placeholder="Name" required className="w-full rounded border border-white/20 bg-black px-3 py-2" />
        <input name="email" type="email" placeholder="Email" required className="w-full rounded border border-white/20 bg-black px-3 py-2" />
        <input name="phone" placeholder="Phone" required className="w-full rounded border border-white/20 bg-black px-3 py-2" />
        <textarea
          name="description"
          placeholder="Project description"
          required
          className="h-32 w-full rounded border border-white/20 bg-black px-3 py-2"
        />
        <input name="budget" placeholder="Budget" required className="w-full rounded border border-white/20 bg-black px-3 py-2" />
        <input name="deadline" type="date" required className="w-full rounded border border-white/20 bg-black px-3 py-2" />
        <button disabled={loading} className="rounded bg-white px-4 py-2 font-semibold text-black hover:bg-zinc-200 disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-zinc-300">{message}</p>}
    </section>
  );
}
