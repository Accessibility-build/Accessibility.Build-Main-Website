-- Analytics for Curb, the site assistant (/admin/assistant).
-- Additive only: no existing table is touched. Rows older than 90 days are deleted by the app.
CREATE TABLE IF NOT EXISTS "assistant_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" text NOT NULL,
	"turn" integer DEFAULT 1 NOT NULL,
	"visitor_hash" text,
	"user_id" text,
	"page_path" text,
	"page_title" text,
	"page_context_sent" boolean DEFAULT false NOT NULL,
	"refers_to_page" boolean DEFAULT false NOT NULL,
	"question" text NOT NULL,
	"answer" text,
	"status" text NOT NULL,
	"error_message" text,
	"model" text,
	"input_tokens" integer,
	"output_tokens" integer,
	"latency_ms" integer,
	"first_token_ms" integer,
	"search_hits" integer DEFAULT 0 NOT NULL,
	"top_score" real,
	"sources" jsonb,
	"feedback" text,
	"feedback_at" timestamp,
	"device" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "assistant_messages_created_idx" ON "assistant_messages" ("created_at");
CREATE INDEX IF NOT EXISTS "assistant_messages_conversation_idx" ON "assistant_messages" ("conversation_id");
CREATE INDEX IF NOT EXISTS "assistant_messages_page_idx" ON "assistant_messages" ("page_path");
CREATE INDEX IF NOT EXISTS "assistant_messages_status_idx" ON "assistant_messages" ("status");

CREATE TABLE IF NOT EXISTS "assistant_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"conversation_id" text,
	"message_id" uuid,
	"visitor_hash" text,
	"page_path" text,
	"detail" text,
	"device" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "assistant_events_created_idx" ON "assistant_events" ("created_at");
CREATE INDEX IF NOT EXISTS "assistant_events_type_idx" ON "assistant_events" ("type");
