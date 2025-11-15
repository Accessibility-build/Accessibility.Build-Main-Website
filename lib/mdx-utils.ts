import fs from "fs"
import path from "path"

// Function to ensure directory exists
export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Initialize content directories
export function initializeContentDirectories() {
  const contentDir = path.join(process.cwd(), "content")
  const blogDir = path.join(contentDir, "blog")

  ensureDirectoryExists(contentDir)
  ensureDirectoryExists(blogDir)

  return { contentDir, blogDir }
}
