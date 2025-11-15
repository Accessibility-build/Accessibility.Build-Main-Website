import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-xl mx-auto mb-8" />
        <Skeleton className="h-10 w-full max-w-xl mx-auto rounded-full" />
      </div>

      <div className="mb-8 flex justify-center">
        <div className="flex items-center justify-center flex-wrap gap-2">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-4">
                <div className="flex gap-2 mb-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
