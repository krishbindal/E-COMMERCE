import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="mb-4 rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-widest text-zinc-300">
        Production-ready marketplace
      </p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
        Launch Faster with Ready-to-Buy Student Projects
      </h1>
      <p className="mt-6 max-w-2xl text-zinc-300">
        Explore curated full-stack projects, pay securely with Razorpay, and get instant delivery via email.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/projects" className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200">
          Explore Projects
        </Link>
        <Link href="/request" className="rounded-lg border border-white/20 px-6 py-3 font-semibold hover:bg-white/10">
          Request Custom Project
        </Link>
      </div>
    </section>
  );
}
