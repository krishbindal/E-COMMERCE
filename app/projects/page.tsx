import { ProjectsGrid } from "@/components/ui/projects-grid";
import { getAllProjects } from "@/lib/sanity";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Explore Projects</h1>
        <p className="mt-2 text-zinc-400">Filter by category and price to find the perfect project quickly.</p>
      </div>
      <ProjectsGrid projects={projects} />
    </section>
  );
}
