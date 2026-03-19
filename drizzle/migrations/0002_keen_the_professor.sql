ALTER TABLE "matches" ADD COLUMN "vrf_request_id" varchar(100);--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "vrf_seed" varchar(100);--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "is_verifiable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "seasons" ADD COLUMN "vrf_request_id" varchar(100);--> statement-breakpoint
ALTER TABLE "seasons" ADD COLUMN "vrf_seed" varchar(100);