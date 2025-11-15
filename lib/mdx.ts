import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { initializeContentDirectories } from "./mdx-utils"

// Define the type for the frontmatter
export interface PostFrontmatter {
  title: string
  description: string
  date: string
  author: string
  authorRole?: string
  authorImage?: string
  tags: string[]
  image?: string
  published: boolean
  readingTime?: string
  lastUpdated?: string
}

// Mock posts for development when content directory doesn't exist yet
const mockPosts = [
  {
    slug: "understanding-wcag-2-2",
    frontmatter: {
      title: "Understanding WCAG 2.2: What's New and How to Prepare",
      description:
        "A comprehensive guide to the latest Web Content Accessibility Guidelines and what they mean for your projects.",
      date: "2023-05-10",
      author: "Alex Johnson",
      authorRole: "Accessibility Specialist",
      authorImage: "/images/authors/alex-johnson.png",
      tags: ["WCAG", "Guidelines", "Compliance"],
      image: "/images/blog/wcag-2-2-guide.png",
      published: true,
      readingTime: "8 min read",
    },
    content: `
      <h2 id="introduction-to-wcag-2-2">Introduction to WCAG 2.2</h2>
      <p>The Web Content Accessibility Guidelines (WCAG) 2.2 builds on the foundation of WCAG 2.1, adding new success criteria to address additional barriers for people with disabilities.</p>
      
      <h2 id="key-changes-in-wcag-2-2">Key Changes in WCAG 2.2</h2>
      <p>WCAG 2.2 introduces several new success criteria, including:</p>
      <ul>
        <li><strong>2.4.11 Focus Appearance (AA):</strong> Ensures that keyboard focus indicators are clearly visible.</li>
        <li><strong>2.5.7 Dragging Movements (AA):</strong> Ensures that functionality that uses dragging movements can be operated by alternative inputs.</li>
        <li><strong>2.5.8 Target Size (AA):</strong> Ensures that interactive elements are large enough to be easily activated.</li>
      </ul>
      
      <h2 id="how-to-prepare-for-wcag-2-2">How to Prepare for WCAG 2.2</h2>
      <p>To prepare for WCAG 2.2, organizations should:</p>
      <ol>
        <li>Review the new success criteria</li>
        <li>Audit existing websites and applications</li>
        <li>Update design systems and development practices</li>
        <li>Train teams on the new requirements</li>
      </ol>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>By understanding and implementing WCAG 2.2, organizations can create more accessible digital experiences for all users.</p>
    `,
  },
  {
    slug: "creating-accessible-forms",
    frontmatter: {
      title: "Creating Accessible Forms: Best Practices and Common Pitfalls",
      description:
        "Learn how to design and develop forms that everyone can use, regardless of ability or assistive technology.",
      date: "2023-04-22",
      author: "Maya Rodriguez",
      authorRole: "UX Designer & Accessibility Advocate",
      authorImage: "/images/authors/maya-rodriguez.png",
      tags: ["Forms", "Development", "UX"],
      image: "/images/blog/accessible-forms.png",
      published: true,
      readingTime: "6 min read",
    },
    content: `
      <h2 id="introduction-to-accessible-forms">Introduction to Accessible Forms</h2>
      <p>Forms are essential components of web applications, but they can present significant barriers for users with disabilities if not designed and implemented properly.</p>
      
      <h2 id="key-principles-for-accessible-forms">Key Principles for Accessible Forms</h2>
      <p>When creating accessible forms, follow these key principles:</p>
      <ul>
        <li><strong>Clear Labels:</strong> Every form control should have a clear, descriptive label.</li>
        <li><strong>Error Handling:</strong> Provide clear error messages and guidance for correction.</li>
        <li><strong>Keyboard Accessibility:</strong> Ensure all form controls can be operated using only a keyboard.</li>
        <li><strong>Logical Structure:</strong> Organize form elements in a logical, predictable order.</li>
      </ul>
      
      <h2 id="common-pitfalls-to-avoid">Common Pitfalls to Avoid</h2>
      <p>Avoid these common accessibility pitfalls when designing forms:</p>
      <ul>
        <li>Placeholder text as the only label</li>
        <li>Color alone to indicate required fields</li>
        <li>Time limits without extensions</li>
        <li>Lack of focus indicators</li>
      </ul>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>By following these best practices and avoiding common pitfalls, you can create forms that are accessible to all users, regardless of their abilities or the assistive technologies they use.</p>
    `,
  },
]

// Get all posts
export async function getAllPosts() {
  try {
    const { blogDir } = initializeContentDirectories()

    // Check if directory exists and has files
    if (!fs.existsSync(blogDir) || fs.readdirSync(blogDir).length === 0) {
      // console.log("Using mock posts as content directory is empty")
      return mockPosts
    }

    const filenames = fs.readdirSync(blogDir)

    const posts = await Promise.all(
      filenames.map(async (filename) => {
        if (!filename.endsWith(".mdx")) return null

        const filePath = path.join(blogDir, filename)
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data, content } = matter(fileContents)
        const slug = filename.replace(/\.mdx$/, "")

        // Calculate reading time (approx 200 words per minute)
        const wordCount = content.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200)

        return {
          slug,
          frontmatter: {
            ...data,
            readingTime: `${readingTime} min read`,
          } as PostFrontmatter,
        }
      }),
    )

    // Filter out null values and sort posts by date in descending order
    return posts
      .filter(Boolean)
      .filter((post) => post?.frontmatter.published)
      .sort((a, b) => {
        return new Date(b!.frontmatter.date).getTime() - new Date(a!.frontmatter.date).getTime()
      })
  } catch (error) {
    console.error("Error getting all posts:", error)
    return mockPosts
  }
}

// Get a single post by slug
export async function getPostBySlug(slug: string) {
  try {
    const { blogDir } = initializeContentDirectories()
    const filePath = path.join(blogDir, `${slug}.mdx`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Return mock post if file doesn't exist
      const mockPost = mockPosts.find((post) => post.slug === slug)
      if (!mockPost) throw new Error(`Post with slug ${slug} not found`)

      // For mock posts, we'll return the mock content
      return {
        frontmatter: mockPost.frontmatter,
        content: mockPost.content,
        toc: extractTOC(mockPost.content),
      }
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    // Calculate reading time
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const frontmatter = {
      ...data,
      readingTime: `${readingTime} min read`,
    } as PostFrontmatter

    // For real posts, we'll just return the raw content for now
    // This avoids the MDX compilation issues
    return {
      frontmatter,
      content: `<div class="prose">
        <p>This is a placeholder for the ${frontmatter.title} content.</p>
        <p>The actual content will be displayed when the MDX compilation is fixed.</p>
      </div>`,
      toc: extractTOC(content),
    }
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)

    // Return mock post if available
    const mockPost = mockPosts.find((post) => post.slug === slug)
    if (mockPost) {
      return {
        frontmatter: mockPost.frontmatter,
        content: mockPost.content,
        toc: extractTOC(mockPost.content),
      }
    }

    throw error
  }
}

// Extract table of contents from content
function extractTOC(content: string) {
  try {
    const headings = content.match(/<h2 id="([^"]+)">(.+?)<\/h2>/g) || []

    return headings.map((heading) => {
      const idMatch = heading.match(/<h2 id="([^"]+)">/) || []
      const textMatch = heading.match(/<h2 id="[^"]+">(.+?)<\/h2>/) || []

      const id = idMatch[1] || ""
      const text = textMatch[1] || ""

      return {
        level: 2,
        text,
        id,
      }
    })
  } catch (error) {
    console.error("Error extracting TOC:", error)
    return null
  }
}
