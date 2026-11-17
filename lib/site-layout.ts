import { isAccountWorkspacePath } from "@/lib/account-routes"
import { isCourseLearningPath } from "@/lib/courses/routes"

/** Dedicated workspaces leave marketing navigation and global overlays behind. */
export function isFocusedWorkspacePath(pathname: string | null | undefined): boolean {
  return isAccountWorkspacePath(pathname) || isCourseLearningPath(pathname)
}
