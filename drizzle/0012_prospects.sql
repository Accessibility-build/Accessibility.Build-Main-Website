-- Sales prospects — one row per researched outreach lead.
-- Additive only: no existing table is touched.
CREATE TABLE IF NOT EXISTS "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" text NOT NULL,
	"website" text,
	"country" text,
	"sector" text,
	"tier" text,
	"sendability" text,
	"email_address" text,
	"address_source" text,
	"contact_role" text,
	"overlay" text,
	"has_statement" boolean DEFAULT false NOT NULL,
	"statement_note" text,
	"findings" jsonb,
	"evidence" text,
	"subject" text,
	"email_body" text,
	"caution" text,
	"score" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"scanned_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prospects_company_unique" UNIQUE("company")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prospects_tier_idx" ON "prospects" ("tier");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prospects_status_idx" ON "prospects" ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prospects_score_idx" ON "prospects" ("score");
