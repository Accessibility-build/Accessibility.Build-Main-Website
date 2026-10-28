-- Lead capture for Curb: AI-judged intent on each question, and the contact requests the
-- lead form sends. Additive only: new columns default to null/false, and one new table.
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "intent" text;
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "intent_confidence" real;
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "intent_services" jsonb;
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "intent_urgency" text;
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "intent_trigger" text;
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "intent_summary" text;
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "lead_score" integer;
ALTER TABLE "assistant_messages" ADD COLUMN IF NOT EXISTS "lead_offered" boolean DEFAULT false NOT NULL;
CREATE INDEX IF NOT EXISTS "assistant_messages_intent_idx" ON "assistant_messages" ("intent");

CREATE TABLE IF NOT EXISTS "assistant_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" text NOT NULL,
	"message_id" uuid,
	"source" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"organisation" text,
	"website" text,
	"message" text NOT NULL,
	"services" jsonb,
	"urgency" text,
	"trigger" text,
	"ai_summary" text,
	"score" integer DEFAULT 0 NOT NULL,
	"page_path" text,
	"prospect_id" uuid,
	"visitor_hash" text,
	"country" text,
	"device" text,
	"notified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "assistant_leads_created_idx" ON "assistant_leads" ("created_at");
CREATE INDEX IF NOT EXISTS "assistant_leads_email_idx" ON "assistant_leads" ("email");
