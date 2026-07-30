import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="rounded-2xl glass-panel p-4">
          <Skeleton className="mb-2 h-24 w-full rounded-xl" />
          <Skeleton className="mx-auto mb-1 h-3 w-12" />
          <Skeleton className="mx-auto h-4 w-20" />
          <div className="mt-2 flex justify-center gap-1">
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
