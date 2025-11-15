import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"

export default function BlogPostLoading() {
  return (
    <article className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
          </div>

          <Skeleton className="h-12 w-full mb-6" />

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <Skeleton className="aspect-video w-full mb-10 rounded-lg" />

        <div className="flex gap-6">
          <div className="hidden lg:block">
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-md" />
                ))}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  {i % 3 === 0 && <Skeleton className="h-8 w-3/4" />}
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  {i % 2 === 0 && <Skeleton className="h-4 w-4/5" />}
                </div>
              ))}
          </div>
        </div>
      </div>
    </article>
  )
}
