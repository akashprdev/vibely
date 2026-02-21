ALTER TABLE "media" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."media_type";--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "type" SET DATA TYPE "public"."media_type" USING "type"::"public"."media_type";--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "type" "media_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "media_type";--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN "video_url";