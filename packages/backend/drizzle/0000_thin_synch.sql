CREATE TYPE "public"."file_extension" AS ENUM('txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png');--> statement-breakpoint
CREATE TYPE "public"."file_type" AS ENUM('file', 'folder');--> statement-breakpoint
CREATE TABLE "file_system" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "file_system_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"path" text NOT NULL,
	"file_type" "file_type" NOT NULL,
	"file_extension" "file_extension",
	"size" integer,
	"parentId" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"ownerId" text,
	CONSTRAINT "file_system_path_unique" UNIQUE("path")
);
--> statement-breakpoint
ALTER TABLE "file_system" ADD CONSTRAINT "file_system_parentId_file_system_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."file_system"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "path_idx" ON "file_system" USING btree ("path");--> statement-breakpoint
CREATE INDEX "parent_idx" ON "file_system" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "type_idx" ON "file_system" USING btree ("file_type");--> statement-breakpoint
CREATE INDEX "owner_idx" ON "file_system" USING btree ("ownerId");