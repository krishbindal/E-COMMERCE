import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProjectDetail() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <Skeleton className="h-[460px] w-full" />
      <Skeleton className="h-[460px] w-full" />
    </section>
  );
}
