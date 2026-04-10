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
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
        {project.image ? (
          <Image src={project.image} alt={project.title} width={1200} height={800} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full min-h-80 items-center justify-center text-zinc-400">No image available</div>
        )}
      </div>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-wide text-zinc-400">{project.category}</p>
        <h1 className="text-3xl font-bold text-white">{project.title}</h1>
        <p className="text-zinc-300">{project.description}</p>
        <BuyButton projectId={project._id} amount={project.price} title={project.title} />
      </div>
    </section>
  );
}
