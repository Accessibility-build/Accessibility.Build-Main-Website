-- Trial usage tracking for non-logged-in users
CREATE TABLE IF NOT EXISTS "trial_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" text NOT NULL,
	"tool" "tool_type" NOT NULL,
	"usage_count" integer DEFAULT 1 NOT NULL,
	"input_data" jsonb,
	"output_data" jsonb,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"user_agent" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add indexes for efficient queries
CREATE INDEX IF NOT EXISTS "trial_usage_ip_tool_idx" ON "trial_usage" ("ip_address", "tool");
CREATE INDEX IF NOT EXISTS "trial_usage_created_at_idx" ON "trial_usage" ("created_at");

-- Add unique constraint for IP + tool combination to track usage per tool per IP
-- Note: We'll handle upserts in code since usage_count needs to be incremented
CREATE UNIQUE INDEX IF NOT EXISTS "trial_usage_ip_tool_unique_idx" ON "trial_usage" ("ip_address", "tool"); 