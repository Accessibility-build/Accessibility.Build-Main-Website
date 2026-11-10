import Image from "next/image"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

/** Bylines that belong to the organisation rather than a person, e.g. "The Accessibility.build Team". */
export function isOrganizationAuthor(name: string): boolean {
  return /accessibility\.build/i.test(name)
}

function initialsFor(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter((w) => !["the", "a", "an", "of", "and", "&"].includes(w.toLowerCase()))
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "A"
  )
}

interface AuthorAvatarProps {
  name: string
  /** Photo URL. When absent, organisation bylines show the site logo and people show initials. */
  image?: string
  /** Pixel size hint for next/image (the parent controls the rendered size). */
  sizes?: string
  textClassName?: string
}

/**
 * Fills its parent (which sets the size, shape and ring). The avatar is decorative:
 * the author's name is always printed beside it, so it carries no accessible name.
 */
export function AuthorAvatar({ name, image, sizes = "56px", textClassName }: AuthorAvatarProps) {
  if (image) {
    return <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
  }
  if (isOrganizationAuthor(name)) {
    return <Logo className="h-full w-full" />
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 font-sans font-semibold text-white",
        textClassName
      )}
    >
      {initialsFor(name)}
    </div>
  )
}
