export function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary dark:border-neutral-700" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Loading...
        </p>
      </div>
    </div>
  );
}
