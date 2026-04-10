"use client";

import { FormEvent, useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast-provider";

type FormFields = {
  name: string;
  email: string;
  phone: string;
  description: string;
  budget: string;
  deadline: string;
};

const initialValues: FormFields = {
  name: "",
  email: "",
  phone: "",
  description: "",
  budget: "",
  deadline: "",
};

export default function RequestPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [values, setValues] = useState<FormFields>(initialValues);
  const { showToast } = useToast();

  const progress = useMemo(() => {
    const filled = Object.values(values).filter((value) => value.trim().length > 0).length;
    return Math.round((filled / Object.keys(values).length) * 100);
  }, [values]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      const text = "Request submitted successfully. We have emailed you confirmation.";
      setMessage(text);
      showToast(text, "success");
      setValues(initialValues);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Submission failed";
      setMessage(text);
      showToast(text, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Request a Custom Project</h1>
        <p className="mt-2 text-zinc-400">Share your requirements and we’ll get back to you with the best approach.</p>
      </div>

      <div className="glass-card p-4">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
          <span>Request completion</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form onSubmit={onSubmit} className="glass-card space-y-4 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            placeholder="Name"
            required
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            className="input-luxury"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            className="input-luxury"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="phone"
            placeholder="Phone"
            required
            value={values.phone}
            onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
            className="input-luxury"
          />
          <input
            name="budget"
            placeholder="Budget"
            required
            value={values.budget}
            onChange={(event) => setValues((prev) => ({ ...prev, budget: event.target.value }))}
            className="input-luxury"
          />
        </div>
        <textarea
          name="description"
          placeholder="Project description"
          required
          value={values.description}
          onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
          className="input-luxury h-36"
        />
        <input
          name="deadline"
          type="date"
          required
          value={values.deadline}
          onChange={(event) => setValues((prev) => ({ ...prev, deadline: event.target.value }))}
          className="input-luxury"
        />
        <button disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Request"}
        </button>
        {message && <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">{message}</p>}
      </form>
    </section>
  );
}
