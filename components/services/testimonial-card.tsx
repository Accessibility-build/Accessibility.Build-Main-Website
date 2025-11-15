import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  image: string
}

export function TestimonialCard({ quote, author, role, company, image }: TestimonialCardProps) {
  return (
    <div className="bg-muted/30 rounded-2xl p-6 border border-border flex flex-col h-full">
      <blockquote className="text-lg mb-6 flex-grow">"{quote}"</blockquote>
      <div className="flex items-center">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image src={image || "/placeholder.svg"} alt={author} fill className="object-cover" sizes="48px" />
        </div>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">
            {role}, {company}
          </div>
        </div>
      </div>
    </div>
  )
}
