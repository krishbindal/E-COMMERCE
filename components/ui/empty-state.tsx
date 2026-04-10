export const EmptyState = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-300">{description}</p>
    </div>
  );
};
