-- Add columns with proper handling of existing data
ALTER TABLE "audit_violations" ADD COLUMN "detected_by" jsonb;--> statement-breakpoint
ALTER TABLE "audit_violations" ADD COLUMN "tool_specific_data" jsonb;--> statement-breakpoint
ALTER TABLE "audit_violations" ADD COLUMN "confidence" integer DEFAULT 100;--> statement-breakpoint

-- Update existing records to have default values
UPDATE "audit_violations" SET "detected_by" = '["axe-core"]' WHERE "detected_by" IS NULL;--> statement-breakpoint

-- Now add NOT NULL constraint
ALTER TABLE "audit_violations" ALTER COLUMN "detected_by" SET NOT NULL;--> statement-breakpoint

-- Add columns to audit table
ALTER TABLE "url_accessibility_audits" ADD COLUMN "tools_used" jsonb;--> statement-breakpoint
ALTER TABLE "url_accessibility_audits" ADD COLUMN "axe_core_results" jsonb;--> statement-breakpoint
ALTER TABLE "url_accessibility_audits" ADD COLUMN "pa11y_results" jsonb;--> statement-breakpoint
ALTER TABLE "url_accessibility_audits" ADD COLUMN "consensus_violations" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "url_accessibility_audits" ADD COLUMN "unique_violations" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "url_accessibility_audits" ADD COLUMN "confidence_score" integer DEFAULT 100;--> statement-breakpoint

-- Update existing audit records with default values
UPDATE "url_accessibility_audits" SET "tools_used" = '["axe-core"]' WHERE "tools_used" IS NULL;