import Link from "next/link";
import { getAllProjects } from "@/lib/sanity";
import { ProjectCard } from "@/components/ui/project-card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function Home() {
  const projects = (await getAllProjects()).slice(0, 3);

  return (
    <div className="space-y-14">
      <section className="glass-card relative overflow-hidden p-8 sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        <div className="relative max-w-3xl animate-fade-up">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-400">Premium Student Marketplace</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Get Your School &amp; College Projects Instantly
          </h1>
          <p className="mt-5 text-base text-zinc-300 sm:text-lg">
            High-quality projects, secure payments, and instant delivery in a polished experience built for students.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary">
              Browse Projects
            </Link>
            <Link href="/request" className="btn-secondary">
              Request Custom Project
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Featured Projects</h2>
            <p className="mt-1 text-sm text-zinc-400">Popular picks students are buying right now.</p>
          </div>
          <Link href="/projects" className="text-sm text-zinc-300 hover:text-white">
            View all →
          </Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState title="No featured projects yet" description="Projects from your CMS will appear here automatically." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Trusted Delivery",
            text: "Instant access links are emailed to you after successful payment.",
          },
          {
            title: "Secure Checkout",
            text: "Razorpay-powered payments and server-side verification keep transactions safe.",
          },
          {
            title: "Custom Projects",
            text: "Need something unique? Send your requirements and get a tailored solution.",
          },
        ].map((item) => (
          <article key={item.title} className="glass-card p-6">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
