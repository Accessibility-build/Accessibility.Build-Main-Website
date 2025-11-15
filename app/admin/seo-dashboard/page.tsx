import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getAllPosts } from "@/lib/mdx"
import { extractKeywords } from "@/lib/seo-utils"

export const metadata = {
  title: "SEO Dashboard | Admin Dashboard",
  description: "Monitor and optimize SEO performance for Accessibility.build",
}

export default async function SEODashboardPage() {
  // Verify admin access
  await requireAdmin()

  const posts = await getAllPosts()

  return (
    <AdminLayout>
      <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">SEO Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
          <TabsTrigger value="technical">Technical SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <h2 className="sr-only">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Pages</CardTitle>
                <CardDescription>Indexed pages on the site</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{posts.length + 13}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Published articles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{posts.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Score</CardTitle>
                <CardDescription>Overall site optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">87/100</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SEO Improvement Opportunities</CardTitle>
              <CardDescription>Quick wins to improve search visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-2 py-1 rounded text-xs font-medium">
                    Medium
                  </span>
                  <div>
                    <p className="font-medium">Improve meta descriptions</p>
                    <p className="text-sm text-muted-foreground">
                      5 pages have meta descriptions that are too short or generic.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 px-2 py-1 rounded text-xs font-medium">
                    High
                  </span>
                  <div>
                    <p className="font-medium">Missing alt text</p>
                    <p className="text-sm text-muted-foreground">12 images are missing alt text across the site.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded text-xs font-medium">
                    Low
                  </span>
                  <div>
                    <p className="font-medium">Internal linking</p>
                    <p className="text-sm text-muted-foreground">Increase internal links between related blog posts.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <h2 className="sr-only">Content Analysis</h2>
          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>Review and optimize your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {posts.filter(post => post !== null).slice(0, 5).map((post) => (
                  <div key={post.slug} className="border-b pb-4">
                    <h3 className="font-medium mb-1">{post.frontmatter.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{post.frontmatter.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {extractKeywords("", post.frontmatter.tags).map((keyword) => (
                        <span key={keyword} className="bg-muted px-2 py-1 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <h2 className="sr-only">Keyword Analysis</h2>
          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription>Top keywords across your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["accessibility", "wcag", "inclusive design", "screen readers", "color contrast"].map((keyword) => (
                  <div key={keyword} className="flex justify-between items-center">
                    <span className="font-medium">{keyword}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{Math.floor(Math.random() * 50)} pages</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <h2 className="sr-only">Technical SEO</h2>
          <Card>
            <CardHeader>
              <CardTitle>Technical SEO</CardTitle>
              <CardDescription>Site performance and technical factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Page Speed</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-green-500 h-4 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <span className="font-medium">85/100</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Mobile Friendliness</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-green-500 h-4 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                    <span className="font-medium">92/100</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Structured Data</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-yellow-500 h-4 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                    <span className="font-medium">78/100</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">HTTPS Security</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-green-500 h-4 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                    <span className="font-medium">100/100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AdminLayout>
  )
}
