import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProjects() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-80 w-full" />
        ))}
      </div>
    </section>
  );
}
