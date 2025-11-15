CREATE TYPE "public"."audit_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('critical', 'serious', 'moderate', 'minor');--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE 'url_accessibility_auditor';--> statement-breakpoint
CREATE TABLE "audit_violations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_id" uuid NOT NULL,
	"violation_id" text NOT NULL,
	"description" text NOT NULL,
	"impact" "severity" NOT NULL,
	"help_url" text,
	"wcag_criteria" jsonb,
	"wcag_level" text,
	"selector" text,
	"html" text,
	"target" jsonb,
	"ai_explanation" text,
	"fix_suggestion" text,
	"code_example" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "url_accessibility_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"status" "audit_status" DEFAULT 'pending' NOT NULL,
	"credits_used" integer DEFAULT 5 NOT NULL,
	"total_violations" integer DEFAULT 0,
	"critical_count" integer DEFAULT 0,
	"serious_count" integer DEFAULT 0,
	"moderate_count" integer DEFAULT 0,
	"minor_count" integer DEFAULT 0,
	"ai_summary" text,
	"priority_recommendations" jsonb,
	"overall_score" integer,
	"processing_started_at" timestamp,
	"processing_completed_at" timestamp,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_violations" ADD CONSTRAINT "audit_violations_audit_id_url_accessibility_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."url_accessibility_audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_accessibility_audits" ADD CONSTRAINT "url_accessibility_audits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;