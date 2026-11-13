-- Paid online courses (first: the CPACC Crash Course). Additive.
-- course_content holds the course text and question bank. The site repo is public, so course
-- content is never committed: it is loaded into this table from the owner's private folder by
-- scripts/courses/seed-course.mjs and served only to signed-in users with a seat.
CREATE TABLE IF NOT EXISTS "course_content" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "course_slug" text NOT NULL,
  "kind" text NOT NULL,          -- meta | chapter | question | flashcard
  "key" text NOT NULL,           -- chapter slug, question id, flashcard index
  "position" integer NOT NULL DEFAULT 0,
  "data" jsonb NOT NULL,
  "edition" text NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "course_content_unique_idx" ON "course_content" ("course_slug", "kind", "key");
CREATE INDEX IF NOT EXISTS "course_content_kind_idx" ON "course_content" ("course_slug", "kind", "position");

-- One licence per purchase (or admin grant). A team licence has several seats.
CREATE TABLE IF NOT EXISTS "course_licences" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "course_slug" text NOT NULL,
  "licence_type" text NOT NULL,  -- individual | team
  "seats" integer NOT NULL DEFAULT 1,
  "owner_user_id" text REFERENCES "users"("id") ON DELETE SET NULL,
  "owner_email" text NOT NULL,
  "billing_order_id" uuid UNIQUE REFERENCES "billing_orders"("id"),
  "source" text NOT NULL,        -- purchase | admin
  "granted_by" text,
  "note" text,
  "revoked_at" timestamp,
  "revoked_reason" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "course_licences_owner_idx" ON "course_licences" ("owner_user_id");
CREATE INDEX IF NOT EXISTS "course_licences_course_idx" ON "course_licences" ("course_slug");

-- A seat is held by an email address. user_id is filled in when that person signs in.
CREATE TABLE IF NOT EXISTS "course_seats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "licence_id" uuid NOT NULL REFERENCES "course_licences"("id") ON DELETE CASCADE,
  "email" text NOT NULL,         -- lower case
  "user_id" text REFERENCES "users"("id") ON DELETE SET NULL,
  "claimed_at" timestamp,
  "invited_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "course_seats_licence_email_idx" ON "course_seats" ("licence_id", "email");
CREATE INDEX IF NOT EXISTS "course_seats_email_idx" ON "course_seats" ("email");
CREATE INDEX IF NOT EXISTS "course_seats_user_idx" ON "course_seats" ("user_id");

-- Practice history, missed questions, flashcard marks and chapter progress, per user and course.
CREATE TABLE IF NOT EXISTS "course_progress" (
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "course_slug" text NOT NULL,
  "data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "course_slug")
);
