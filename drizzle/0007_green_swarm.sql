DO $$ BEGIN
 CREATE TYPE "public"."billing_funnel_event_type" AS ENUM('checkout_click', 'checkout_auth_required', 'checkout_session_created', 'checkout_session_failed', 'checkout_invalid_catalog', 'portal_click', 'portal_auth_required', 'portal_session_created', 'portal_session_failed', 'webhook_paid', 'webhook_pending', 'webhook_failed', 'webhook_refund', 'webhook_duplicate', 'webhook_error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing_funnel_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" "billing_funnel_event_type" NOT NULL,
	"event_source" text NOT NULL,
	"user_id" text,
	"order_id" uuid,
	"catalog_key" text,
	"stripe_checkout_session_id" text,
	"status" text,
	"error_code" text,
	"error_message" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing_funnel_events" ADD CONSTRAINT "billing_funnel_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing_funnel_events" ADD CONSTRAINT "billing_funnel_events_order_id_billing_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."billing_orders"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_funnel_events_created_at_idx" ON "billing_funnel_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_funnel_events_event_type_created_at_idx" ON "billing_funnel_events" USING btree ("event_type","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_funnel_events_user_created_at_idx" ON "billing_funnel_events" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_funnel_events_order_created_at_idx" ON "billing_funnel_events" USING btree ("order_id","created_at");
