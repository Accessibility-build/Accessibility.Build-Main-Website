CREATE TABLE "email_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"source" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp,
	"metadata" jsonb,
	CONSTRAINT "email_subscriptions_email_unique" UNIQUE("email")
);
