CREATE TABLE "translation_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"converted_file_id" integer NOT NULL,
	"log_filename" varchar NOT NULL,
	"download_url" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "translation_logs" ADD CONSTRAINT "translation_logs_converted_file_id_converted_files_id_fk" FOREIGN KEY ("converted_file_id") REFERENCES "public"."converted_files"("id") ON DELETE cascade ON UPDATE no action;