import Image from "next/image"

// Photographs for case studies.
//
// Every image here is public domain or CC0 and is self-hosted, never hotlinked.
// Credit is shown even where the licence does not require it, because a page
// that argues about evidence should say where its material came from. Nothing
// depicts a defendant's branding or a private individual.

export interface CasePhotoProps {
  src: string
  /** Describes the image for someone who cannot see it. Never the credit line. */
  alt: string
  /** What the reader should take from it, shown under the image. */
  caption: string
  /** Photographer or source, plus the licence. */
  credit: string
  /** Link to the source record. */
  creditHref: string
  width: number
  height: number
  /** Set on the first image in the viewport so it is not lazy-loaded. */
  priority?: boolean
}

export function CasePhoto({
  src,
  alt,
  caption,
  credit,
  creditHref,
  width,
  height,
  priority = false,
}: CasePhotoProps) {
  return (
    <figure className="not-prose my-10">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {caption}{" "}
        <span className="text-slate-500 dark:text-slate-500">
          <a
            href={creditHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600 dark:decoration-slate-600 dark:hover:decoration-slate-300"
          >
            {credit}
          </a>
        </span>
      </figcaption>
    </figure>
  )
}
