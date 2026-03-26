import { Skeleton } from "@/components/ui/skeleton";

// グローバルローディングUI
export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`skeleton-${i}`} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
