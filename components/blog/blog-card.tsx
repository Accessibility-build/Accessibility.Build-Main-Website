import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { ResponsiveText } from "@/components/responsive-text"

interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    description: string
    date: string
    author: string
    authorRole?: string
    authorImage?: string
    tags: string[]
    image?: string
    readingTime?: string
    featured?: boolean
  }
}

interface BlogCardProps {
  post: BlogPost
  variant?: "grid" | "featured" | "list"
}

export function BlogCard({ post, variant = "grid" }: BlogCardProps) {
  if (variant === "featured") {
    return (
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
        <div className="grid md:grid-cols-5 h-full">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-0 md:relative h-48 md:h-full">
              <Image
                src={
                  post.frontmatter.image || "/placeholder.svg?height=400&width=600&query=blog post about accessibility"
                }
                alt={`Featured image for ${post.frontmatter.title}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col p-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {post.frontmatter.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>

            <ResponsiveText component="h3" className="text-xl md:text-2xl font-bold mb-2" maxLines={2}>
              {post.frontmatter.title}
            </ResponsiveText>

            <ResponsiveText className="text-muted-foreground mb-4" maxLines={2}>
              {post.frontmatter.description}
            </ResponsiveText>

            <div className="flex items-center text-sm text-muted-foreground mb-4 mt-auto">
              <div className="flex items-center mr-4">
                <Calendar className="mr-1 h-4 w-4" />
                <time dateTime={post.frontmatter.date}>{post.frontmatter.date}</time>
              </div>
              {post.frontmatter.readingTime && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{post.frontmatter.readingTime}</span>
                </div>
              )}
            </div>

            <Button asChild variant="default" className="w-full md:w-auto">
              <Link href={`/blog/${post.slug}`} prefetch={false}>
                Read article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  if (variant === "list") {
    return (
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 relative">
            <div className="aspect-video md:aspect-square relative">
              <Image
                src={
                  post.frontmatter.image || "/placeholder.svg?height=300&width=300&query=blog post about accessibility"
                }
                alt={`Featured image for ${post.frontmatter.title}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                {post.frontmatter.featured && <Badge className="bg-primary">Featured</Badge>}
              </div>
            </div>
          </div>
          <div className="md:w-3/4 p-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {post.frontmatter.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>

            <ResponsiveText component="h3" className="text-xl font-bold mb-2" maxLines={2}>
              {post.frontmatter.title}
            </ResponsiveText>

            <ResponsiveText className="text-muted-foreground mb-4" maxLines={2}>
              {post.frontmatter.description}
            </ResponsiveText>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={
                      post.frontmatter.authorImage ||
                      "/placeholder.svg?height=32&width=32&query=headshot of accessibility expert" ||
                      "/placeholder.svg"
                    }
                    alt={post.frontmatter.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{post.frontmatter.author}</p>
                  <div className="flex items-center text-muted-foreground">
                    <time dateTime={post.frontmatter.date}>{post.frontmatter.date}</time>
                    {post.frontmatter.readingTime && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{post.frontmatter.readingTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button asChild variant="ghost" className="group">
                <Link href={`/blog/${post.slug}`} prefetch={false}>
                  Read
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Default grid view
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={post.frontmatter.image || "/placeholder.svg?height=300&width=600&query=blog post about accessibility"}
          alt={`Featured image for ${post.frontmatter.title}`}
          fill
          className="object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 right-2">
          {post.frontmatter.featured && <Badge className="bg-primary">Featured</Badge>}
        </div>
      </div>
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          {post.frontmatter.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <ResponsiveText component="h3" className="text-xl font-bold" maxLines={2}>
          {post.frontmatter.title}
        </ResponsiveText>

        <ResponsiveText className="text-muted-foreground" maxLines={3}>
          {post.frontmatter.description}
        </ResponsiveText>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={
                post.frontmatter.authorImage ||
                "/placeholder.svg?height=32&width=32&query=headshot of accessibility expert" ||
                "/placeholder.svg"
              }
              alt={post.frontmatter.author}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-medium">{post.frontmatter.author}</p>
            <p className="text-muted-foreground">{post.frontmatter.date}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="ghost" className="group w-full">
          <Link href={`/blog/${post.slug}`} prefetch={false}>
            Read article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
