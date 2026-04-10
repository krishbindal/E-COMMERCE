import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      href={`/project/${project._id}`}
      className="group glass-card relative overflow-hidden p-4 transition duration-300 hover:-translate-y-1 hover:border-white/30"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0 opacity-0 transition group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              width={640}
              height={360}
              className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center text-sm text-zinc-500">Preview coming soon</div>
          )}
        </div>
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
          <span>{project.category}</span>
          <span className="rounded-full border border-white/20 bg-white/5 px-2 py-1 text-zinc-200">₹{project.price}</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
        <p className="line-clamp-3 text-sm text-zinc-300">{project.description}</p>
      </div>
    </Link>
  );
};
