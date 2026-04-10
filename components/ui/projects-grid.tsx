"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ui/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Project } from "@/lib/types";

type Props = {
  projects: Project[];
};

export const ProjectsGrid = ({ projects }: Props) => {
  const [category, setCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(
    projects.length ? Math.max(...projects.map((project) => project.price)) : 5000,
  );

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(projects.map((project) => project.category).filter(Boolean)))],
    [projects],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) => (category === "all" || project.category === category) && Number(project.price) <= maxPrice,
      ),
    [projects, category, maxPrice],
  );

  return (
    <section className="space-y-6">
      <div className="glass-card p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">Category</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-luxury">
              {categories.map((item) => (
                <option key={item} value={item} className="bg-black">
                  {item === "all" ? "All categories" : item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">Max price: ₹{maxPrice}</label>
            <input
              type="range"
              min={0}
              max={projects.length ? Math.max(...projects.map((project) => project.price)) : 5000}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-white md:w-72"
            />
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try a different category or increase the price range to see more results."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};
