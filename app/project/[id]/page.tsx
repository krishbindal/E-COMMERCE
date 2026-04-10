import Image from "next/image";
import { notFound } from "next/navigation";
import { BuyButton } from "@/components/ui/buy-button";
import { getProjectById } from "@/lib/sanity";

type ProjectDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="glass-card overflow-hidden p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              width={1400}
              height={900}
              className="h-[320px] w-full object-cover sm:h-[460px]"
              priority
            />
          ) : (
            <div className="flex h-[320px] items-center justify-center text-zinc-500 sm:h-[460px]">No preview image available</div>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="glass-card space-y-5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{project.category}</p>
          <h1 className="text-3xl font-semibold leading-tight text-white">{project.title}</h1>
          <p className="text-zinc-300">{project.description}</p>

          <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200">Price</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-100">₹{project.price}</p>
          </div>

          <BuyButton projectId={project._id} amount={project.price} title={project.title} />
        </div>
      </aside>
    </section>
  );
}
