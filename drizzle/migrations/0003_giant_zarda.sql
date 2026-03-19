CREATE TABLE "quests" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"reward" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"frequency" varchar(20) NOT NULL,
	"target" integer NOT NULL,
	"external_url" text,
	"status" varchar(20) DEFAULT 'LIVE' NOT NULL,
	"category" varchar(50),
	"requires_verification" boolean DEFAULT false,
	"verification_placeholder" varchar(255),
	"verification_type" varchar(50),
	"verification_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_check_in_date" timestamp;