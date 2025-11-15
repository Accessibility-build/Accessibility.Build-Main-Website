import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface RelatedItem {
  title: string
  description: string
  url: string
  type: "blog" | "tool" | "resource" | "service"
}

interface RelatedContentProps {
  title?: string
  items: RelatedItem[]
  className?: string
}

export function RelatedContent({ title = "Related Content", items, className = "" }: RelatedContentProps) {
  if (items.length === 0) return null

  return (
    <div className={`mt-8 ${className}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link href={item.url} className="block h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">{item.title}</CardTitle>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">{item.type}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                <div className="flex items-center mt-2 text-sm text-primary font-medium group">
                  Read more
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
