CREATE TABLE IF NOT EXISTS "published_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT 'Accessibility findings' NOT NULL,
	"description" text,
	"issues" jsonb NOT NULL,
	"image_base64" text NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "published_reports_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "published_reports" ADD CONSTRAINT "published_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "published_reports_user_idx" ON "published_reports" ("user_id");
