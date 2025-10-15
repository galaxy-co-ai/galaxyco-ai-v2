export function LoadingCard() {
  return (
    <div className="card animate-pulse p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}
