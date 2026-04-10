import Link from "next/link";
import type { Project } from "@/lib/types";

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      href={`/project/${project._id}`}
      className="group rounded-xl border border-white/10 bg-zinc-950 p-5 transition hover:-translate-y-1 hover:border-white/30 hover:shadow-2xl"
    >
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
        <span>{project.category}</span>
        <span>₹{project.price}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
      <p className="line-clamp-3 text-sm text-zinc-300">{project.description}</p>
    </Link>
  );
};
