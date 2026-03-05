DO $$ BEGIN
 CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'razorpay');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "public"."billing_funnel_event_type" ADD VALUE IF NOT EXISTS 'checkout_fallback_payment_link' BEFORE 'portal_click';--> statement-breakpoint
ALTER TYPE "public"."billing_funnel_event_type" ADD VALUE IF NOT EXISTS 'manage_click' BEFORE 'portal_click';--> statement-breakpoint
ALTER TYPE "public"."billing_funnel_event_type" ADD VALUE IF NOT EXISTS 'manage_auth_required' BEFORE 'portal_click';--> statement-breakpoint
ALTER TYPE "public"."billing_funnel_event_type" ADD VALUE IF NOT EXISTS 'manage_session_created' BEFORE 'portal_click';--> statement-breakpoint
ALTER TYPE "public"."billing_funnel_event_type" ADD VALUE IF NOT EXISTS 'manage_session_failed' BEFORE 'portal_click';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "razorpay_webhook_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"processed_at" timestamp,
	"processing_status" text DEFAULT 'processing' NOT NULL,
	"order_id" uuid,
	"error_message" text,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_funnel_events" ADD COLUMN IF NOT EXISTS "payment_provider" "payment_provider";--> statement-breakpoint
ALTER TABLE "billing_funnel_events" ADD COLUMN IF NOT EXISTS "currency" text;--> statement-breakpoint
ALTER TABLE "billing_funnel_events" ADD COLUMN IF NOT EXISTS "provider_order_id" text;--> statement-breakpoint
ALTER TABLE "billing_funnel_events" ADD COLUMN IF NOT EXISTS "provider_payment_id" text;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "payment_provider" "payment_provider" DEFAULT 'stripe' NOT NULL;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "base_amount_usd_cents" integer;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "amount_total_usd_cents" integer;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "fx_rate_usd_to_inr" text;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "fx_rate_timestamp" timestamp;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "provider_order_id" text;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "provider_payment_id" text;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "provider_payment_link_id" text;--> statement-breakpoint
ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "provider_refund_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "razorpay_customer_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "razorpay_webhook_events" ADD CONSTRAINT "razorpay_webhook_events_order_id_billing_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."billing_orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_orders_provider_order_idx" ON "billing_orders" USING btree ("provider_order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_orders_payment_provider_idx" ON "billing_orders" USING btree ("payment_provider");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing_orders" ADD CONSTRAINT "billing_orders_provider_order_id_unique" UNIQUE("provider_order_id");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_razorpay_customer_id_unique" UNIQUE("razorpay_customer_id");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
