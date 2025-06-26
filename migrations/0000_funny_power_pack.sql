CREATE TABLE "conversion_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_id" integer NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"progress" real DEFAULT 0,
	"error_message" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "converted_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_file_id" integer NOT NULL,
	"target_language" varchar NOT NULL,
	"filename" varchar NOT NULL,
	"output_format" varchar NOT NULL,
	"size" integer NOT NULL,
	"download_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"log_filename" varchar
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"filename" varchar NOT NULL,
	"mime_type" varchar NOT NULL,
	"size" integer NOT NULL,
	"source_language" varchar,
	"target_languages" text[],
	"status" varchar DEFAULT 'uploaded' NOT NULL,
	"conversion_progress" real DEFAULT 0,
	"output_formats" text[],
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"notification_settings" jsonb DEFAULT '{}'::jsonb,
	"default_source_language" varchar DEFAULT 'auto',
	"default_target_languages" text[],
	"theme" varchar DEFAULT 'light',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"preferred_language" varchar DEFAULT 'en',
	"auth_provider" varchar DEFAULT 'email',
	"email_verified" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "conversion_jobs" ADD CONSTRAINT "conversion_jobs_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "converted_files" ADD CONSTRAINT "converted_files_original_file_id_files_id_fk" FOREIGN KEY ("original_file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");