# Held blog posts

Modules here are finished drafts waiting on an outside event. `scripts/publish-blog-posts.mjs`
only reads `scripts/blog-new/`, so nothing in this folder can be published by accident.

- `en-301-549-v4-1-1-cited-official-journal.mjs`: publish on the day the Commission cites
  EN 301 549 V4.1.1 in the Official Journal (expected 16 December 2026). Fill every
  `TODO_CITATION_` token, keep one of the VARIANT A/B paragraphs, set `publishedAt`, then
  move the file to `scripts/blog-new/` and run
  `node scripts/publish-blog-posts.mjs --only=en-301-549-v4-1-1-cited-official-journal`.
  See `docs/en-301-549-citation-day.md`.
