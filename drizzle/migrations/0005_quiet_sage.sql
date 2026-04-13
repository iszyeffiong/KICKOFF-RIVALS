CREATE TABLE "push_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" varchar(42) NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD COLUMN "tx_hash" varchar(100);--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "tx_hash" varchar(100);--> statement-breakpoint
ALTER TABLE "user_quests" ADD COLUMN "proof" text;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_wallet_address_users_wallet_address_fk" FOREIGN KEY ("wallet_address") REFERENCES "public"."users"("wallet_address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "push_wallet_idx" ON "push_subscriptions" USING btree ("wallet_address");--> statement-breakpoint
CREATE UNIQUE INDEX "push_endpoint_idx" ON "push_subscriptions" USING btree ("endpoint");