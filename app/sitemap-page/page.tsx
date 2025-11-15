import Link from "next/link"
import type { Metadata } from "next"
import { getAllPosts } from "@/lib/mdx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Sitemap | Accessibility.build",
  description: "A complete list of all pages on Accessibility.build",
}

export default async function SitemapPage() {
  const posts = await getAllPosts()

  const mainPages = [
    { title: "Home", path: "/" },
    { title: "Blog", path: "/blog" },
    { title: "Tools", path: "/tools" },
    { title: "Checklists", path: "/checklists" },
    { title: "Resources", path: "/resources" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "Services", path: "/services" },
  ]

  const toolPages = [
    { title: "Contrast Checker", path: "/tools/contrast-checker" },
    { title: "Alt Text Generator", path: "/tools/alt-text-generator" },
  ]

  const checklistPages = [{ title: "WCAG 2.2 Checklist", path: "/checklists/wcag-2-2" }]

  const legalPages = [
    { title: "Privacy Policy", path: "/privacy" },
    { title: "Terms of Service", path: "/terms" },
    { title: "Accessibility Statement", path: "/accessibility" },
  ]

  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Sitemap</h1>
        <p className="text-xl text-muted-foreground mb-8">A complete list of all pages on Accessibility.build</p>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Main Pages</CardTitle>
              <CardDescription>Primary navigation pages</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mainPages.map((page) => (
                  <li key={page.path}>
                    <Link href={page.path} className="text-primary hover:underline">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
              <CardDescription>Interactive accessibility tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {toolPages.map((page) => (
                  <li key={page.path}>
                    <Link href={page.path} className="text-primary hover:underline">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklists</CardTitle>
              <CardDescription>Accessibility checklists and guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checklistPages.map((page) => (
                  <li key={page.path}>
                    <Link href={page.path} className="text-primary hover:underline">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Articles and tutorials</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-2">
                {posts.filter(post => post !== null).map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                      {post.frontmatter.title}
                    </Link>
                    <span className="text-sm text-muted-foreground ml-2">
                      {new Date(post.frontmatter.date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Pages</CardTitle>
              <CardDescription>Policies and legal information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {legalPages.map((page) => (
                  <li key={page.path}>
                    <Link href={page.path} className="text-primary hover:underline">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-muted-foreground">
            Can't find what you're looking for?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
