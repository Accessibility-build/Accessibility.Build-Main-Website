DO $$ BEGIN
 CREATE TYPE "public"."billing_order_status" AS ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'action_required');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'accessibility_code_generator';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'heading_analyzer';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'color_palette_generator';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'mobile_accessibility_checker';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'password_generator';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'json_formatter';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'base64_converter';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'image_color_picker';--> statement-breakpoint
ALTER TYPE "public"."tool_type" ADD VALUE IF NOT EXISTS 'url_encoder_decoder';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"catalog_key" text NOT NULL,
	"credits" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"amount_subtotal" integer NOT NULL,
	"amount_tax" integer DEFAULT 0 NOT NULL,
	"amount_total" integer NOT NULL,
	"status" "billing_order_status" DEFAULT 'pending' NOT NULL,
	"stripe_checkout_session_id" text,
	"stripe_customer_id" text,
	"stripe_payment_intent_id" text,
	"stripe_invoice_id" text,
	"stripe_charge_id" text,
	"stripe_refund_id" text,
	"credit_transaction_id" uuid,
	"failure_reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "billing_orders_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_webhook_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"livemode" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp,
	"processing_status" text DEFAULT 'processing' NOT NULL,
	"order_id" uuid,
	"error_message" text,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing_orders" ADD CONSTRAINT "billing_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing_orders" ADD CONSTRAINT "billing_orders_credit_transaction_id_credit_transactions_id_fk" FOREIGN KEY ("credit_transaction_id") REFERENCES "public"."credit_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stripe_webhook_events" ADD CONSTRAINT "stripe_webhook_events_order_id_billing_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."billing_orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
