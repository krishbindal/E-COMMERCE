import { getAllProjects } from "@/lib/sanity";
import { ProjectCard } from "@/components/ui/project-card";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Marketplace Projects</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
