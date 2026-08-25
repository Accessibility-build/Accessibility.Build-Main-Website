-- Track outreach sends made from the admin prospects panel.
-- Additive and nullable: existing rows are unaffected, and the seed script
-- (scripts/seed-prospects.mjs) does not set these columns, so re-seeding
-- never clears a recorded send.
ALTER TABLE "prospects" ADD COLUMN IF NOT EXISTS "sent_at" timestamp;
--> statement-breakpoint
ALTER TABLE "prospects" ADD COLUMN IF NOT EXISTS "resend_id" text;
