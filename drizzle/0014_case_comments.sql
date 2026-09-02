-- Reader comments on case studies (/cases/<slug>).
-- Additive only: no existing table is touched.
DO $$ BEGIN
	CREATE TYPE "case_comment_status" AS ENUM('pending', 'approved', 'rejected', 'spam');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "case_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_slug" text NOT NULL,
	"user_id" text NOT NULL,
	"author_name" text NOT NULL,
	"author_image" text,
	"body" text NOT NULL,
	"status" "case_comment_status" DEFAULT 'pending' NOT NULL,
	"moderated_at" timestamp,
	"moderated_by" text,
	"moderation_note" text,
	"ip_hash" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "case_comments_case_idx" ON "case_comments" ("case_slug");
CREATE INDEX IF NOT EXISTS "case_comments_status_idx" ON "case_comments" ("status");
CREATE INDEX IF NOT EXISTS "case_comments_created_idx" ON "case_comments" ("created_at");
CREATE INDEX IF NOT EXISTS "case_comments_user_idx" ON "case_comments" ("user_id");
