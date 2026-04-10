import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDashboard() {
  return (
    <section className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </section>
  );
}
