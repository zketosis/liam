SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."category_enum" AS ENUM (
    'MIGRATION_SAFETY',
    'DATA_INTEGRITY',
    'PERFORMANCE_IMPACT',
    'PROJECT_RULES_CONSISTENCY',
    'SECURITY_OR_SCALABILITY'
);


ALTER TYPE "public"."category_enum" OWNER TO "postgres";


CREATE TYPE "public"."knowledge_type" AS ENUM (
    'SCHEMA',
    'DOCS'
);


ALTER TYPE "public"."knowledge_type" OWNER TO "postgres";


CREATE TYPE "public"."schema_format_enum" AS ENUM (
    'schemarb',
    'postgres',
    'prisma',
    'tbls'
);


ALTER TYPE "public"."schema_format_enum" OWNER TO "postgres";


CREATE TYPE "public"."severity_enum" AS ENUM (
    'CRITICAL',
    'WARNING',
    'POSITIVE',
    'QUESTION'
);


ALTER TYPE "public"."severity_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public."user" (id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_existing_users"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public."user" (id, name, email)
  SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'name', au.email),
    au.email
  FROM auth.users au
  LEFT JOIN public."user" pu ON au.id = pu.id
  WHERE pu.id IS NULL;
END;
$$;


ALTER FUNCTION "public"."sync_existing_users"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."github_doc_file_path" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "path" "text" NOT NULL,
    "is_review_enabled" boolean DEFAULT true NOT NULL,
    "project_id" uuid NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."github_doc_file_path" OWNER TO "postgres";









CREATE TABLE IF NOT EXISTS "public"."github_schema_file_path" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "path" "text" NOT NULL,
    "project_id" uuid NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "format" "public"."schema_format_enum" NOT NULL
);


ALTER TABLE "public"."github_schema_file_path" OWNER TO "postgres";









CREATE TABLE IF NOT EXISTS "public"."knowledge_suggestion" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "type" "public"."knowledge_type" NOT NULL,
    "title" "text" NOT NULL,
    "path" "text" NOT NULL,
    "content" "text" NOT NULL,
    "file_sha" "text",
    "project_id" uuid NOT NULL,
    "approved_at" timestamp(3) without time zone,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "branch_name" "text" NOT NULL,
    "trace_id" "text",
    "reasoning" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."knowledge_suggestion" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."knowledge_suggestion_doc_mapping" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "knowledge_suggestion_id" uuid NOT NULL,
    "github_doc_file_path_id" uuid NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."knowledge_suggestion_doc_mapping" OWNER TO "postgres";
















CREATE TABLE IF NOT EXISTS "public"."membership_invites" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "email" "text" NOT NULL,
    "invite_by_user_id" "uuid" NOT NULL,
    "organization_id" uuid NOT NULL,
    "invited_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."membership_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."migration" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "title" "text" NOT NULL,
    "pull_request_id" uuid NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."migration" OWNER TO "postgres";









CREATE TABLE IF NOT EXISTS "public"."organization" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" "text" NOT NULL
);


ALTER TABLE "public"."organization" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organization_member" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "user_id" "uuid" NOT NULL,
    "organization_id" uuid NOT NULL,
    "joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."organization_member" OWNER TO "postgres";




CREATE TABLE IF NOT EXISTS "public"."overall_review" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "project_id" uuid,
    "pull_request_id" uuid NOT NULL,
    "review_comment" "text",
    "reviewed_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "branch_name" "text" NOT NULL,
    "trace_id" "text"
);


ALTER TABLE "public"."overall_review" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."overall_review_knowledge_suggestion_mapping" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "overall_review_id" uuid NOT NULL,
    "knowledge_suggestion_id" uuid NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."overall_review_knowledge_suggestion_mapping" OWNER TO "postgres";
















CREATE TABLE IF NOT EXISTS "public"."project" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "organization_id" uuid );


ALTER TABLE "public"."project" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_repository_mapping" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "project_id" uuid NOT NULL,
    "repository_id" uuid NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."project_repository_mapping" OWNER TO "postgres";
















CREATE TABLE IF NOT EXISTS "public"."pull_request" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "pull_number" bigint NOT NULL,
    "comment_id" bigint,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "repository_id" uuid NOT NULL
);


ALTER TABLE "public"."pull_request" OWNER TO "postgres";









CREATE TABLE IF NOT EXISTS "public"."repository" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" "text" NOT NULL,
    "owner" "text" NOT NULL,
    "installation_id" integer NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."repository" OWNER TO "postgres";









CREATE TABLE IF NOT EXISTS "public"."review_feedback" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "overall_review_id" uuid NOT NULL,
    "category" "public"."category_enum" NOT NULL,
    "severity" "public"."severity_enum" NOT NULL,
    "description" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "suggestion" "text" NOT NULL,
    "resolved_at" timestamp(3) without time zone,
    "resolution_comment" "text"
);


ALTER TABLE "public"."review_feedback" OWNER TO "postgres";






CREATE TABLE IF NOT EXISTS "public"."review_feedback_comment" (
    "id" uuid  DEFAULT gen_random_uuid(),
    "review_feedback_id" uuid NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."review_feedback_comment" OWNER TO "postgres";













CREATE TABLE IF NOT EXISTS "public"."review_suggestion_snippet" (
    "id" uuid  DEFAULT gen_random_uuid(),
    "review_feedback_id" uuid NOT NULL,
    "filename" "text" NOT NULL,
    "snippet" "text" NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."review_suggestion_snippet" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL
);


ALTER TABLE "public"."user" OWNER TO "postgres";






































ALTER TABLE ONLY "public"."github_doc_file_path"
    ADD CONSTRAINT "github_doc_file_path_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."github_schema_file_path"
    ADD CONSTRAINT "github_schema_file_path_path_project_id_key" UNIQUE ("path", "project_id");



ALTER TABLE ONLY "public"."github_schema_file_path"
    ADD CONSTRAINT "github_schema_file_path_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."knowledge_suggestion_doc_mapping"
    ADD CONSTRAINT "knowledge_suggestion_doc_mapping_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."knowledge_suggestion"
    ADD CONSTRAINT "knowledge_suggestion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."membership_invites"
    ADD CONSTRAINT "membership_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."migration"
    ADD CONSTRAINT "migration_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organization_member"
    ADD CONSTRAINT "organization_member_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organization_member"
    ADD CONSTRAINT "organization_member_user_id_organization_id_key" UNIQUE ("user_id", "organization_id");



ALTER TABLE ONLY "public"."organization"
    ADD CONSTRAINT "organization_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."overall_review_knowledge_suggestion_mapping"
    ADD CONSTRAINT "overall_review_knowledge_suggestion_mapping_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."overall_review"
    ADD CONSTRAINT "overall_review_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_repository_mapping"
    ADD CONSTRAINT "project_repository_mapping_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "project_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pull_request"
    ADD CONSTRAINT "pull_request_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."repository"
    ADD CONSTRAINT "repository_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_feedback_comment"
    ADD CONSTRAINT "review_feedback_comment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_feedback"
    ADD CONSTRAINT "review_feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_suggestion_snippet"
    ADD CONSTRAINT "review_suggestion_snippet_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "github_doc_file_path_path_project_id_key" ON "public"."github_doc_file_path" USING "btree" ("path", "project_id");



CREATE UNIQUE INDEX "github_schema_file_path_project_id_key" ON "public"."github_schema_file_path" USING "btree" ("project_id");



CREATE UNIQUE INDEX "knowledge_suggestion_doc_mapping_unique_mapping" ON "public"."knowledge_suggestion_doc_mapping" USING "btree" ("knowledge_suggestion_id", "github_doc_file_path_id");



CREATE UNIQUE INDEX "migration_pull_request_id_key" ON "public"."migration" USING "btree" ("pull_request_id");



CREATE UNIQUE INDEX "overall_review_knowledge_suggestion_mapping_unique_mapping" ON "public"."overall_review_knowledge_suggestion_mapping" USING "btree" ("overall_review_id", "knowledge_suggestion_id");



CREATE UNIQUE INDEX "project_repository_mapping_project_id_repository_id_key" ON "public"."project_repository_mapping" USING "btree" ("project_id", "repository_id");



CREATE UNIQUE INDEX "pull_request_repository_id_pull_number_key" ON "public"."pull_request" USING "btree" ("repository_id", "pull_number");



CREATE UNIQUE INDEX "repository_owner_name_key" ON "public"."repository" USING "btree" ("owner", "name");



CREATE INDEX "idx_project_organization_id" ON "public"."project" USING "btree" ("organization_id");



CREATE INDEX "idx_review_feedback_comment_review_feedback_id" ON "public"."review_feedback_comment" USING "btree" ("review_feedback_id");



CREATE INDEX "membership_invites_email_idx" ON "public"."membership_invites" USING "btree" ("email");



CREATE INDEX "membership_invites_org_id_idx" ON "public"."membership_invites" USING "btree" ("organization_id");



CREATE INDEX "organization_member_organization_id_idx" ON "public"."organization_member" USING "btree" ("organization_id");



CREATE INDEX "organization_member_user_id_idx" ON "public"."organization_member" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."github_doc_file_path"
    ADD CONSTRAINT "github_doc_file_path_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."github_schema_file_path"
    ADD CONSTRAINT "github_schema_file_path_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."knowledge_suggestion_doc_mapping"
    ADD CONSTRAINT "knowledge_suggestion_doc_mapping_github_doc_file_path_id_fkey" FOREIGN KEY ("github_doc_file_path_id") REFERENCES "public"."github_doc_file_path"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."knowledge_suggestion_doc_mapping"
    ADD CONSTRAINT "knowledge_suggestion_doc_mapping_knowledge_suggestion_id_fkey" FOREIGN KEY ("knowledge_suggestion_id") REFERENCES "public"."knowledge_suggestion"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."knowledge_suggestion"
    ADD CONSTRAINT "knowledge_suggestion_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."membership_invites"
    ADD CONSTRAINT "membership_invites_invite_by_user_id_fkey" FOREIGN KEY ("invite_by_user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."membership_invites"
    ADD CONSTRAINT "membership_invites_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."migration"
    ADD CONSTRAINT "migration_pull_request_id_fkey" FOREIGN KEY ("pull_request_id") REFERENCES "public"."pull_request"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."organization_member"
    ADD CONSTRAINT "organization_member_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_member"
    ADD CONSTRAINT "organization_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."overall_review_knowledge_suggestion_mapping"
    ADD CONSTRAINT "overall_review_knowledge_suggestion_mapping_knowledge_suggestion_id_f" FOREIGN KEY ("knowledge_suggestion_id") REFERENCES "public"."knowledge_suggestion"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."overall_review_knowledge_suggestion_mapping"
    ADD CONSTRAINT "overall_review_knowledge_suggestion_mapping_overall_review_id_fkey" FOREIGN KEY ("overall_review_id") REFERENCES "public"."overall_review"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."overall_review"
    ADD CONSTRAINT "overall_review_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."overall_review"
    ADD CONSTRAINT "overall_review_pull_request_id_fkey" FOREIGN KEY ("pull_request_id") REFERENCES "public"."pull_request"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."project_repository_mapping"
    ADD CONSTRAINT "project_repository_mapping_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."project_repository_mapping"
    ADD CONSTRAINT "project_repository_mapping_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "public"."repository"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pull_request"
    ADD CONSTRAINT "pull_request_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "public"."repository"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."review_feedback_comment"
    ADD CONSTRAINT "review_feedback_comment_review_feedback_id_fkey" FOREIGN KEY ("review_feedback_id") REFERENCES "public"."review_feedback"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review_feedback_comment"
    ADD CONSTRAINT "review_feedback_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review_feedback"
    ADD CONSTRAINT "review_feedback_overall_review_id_fkey" FOREIGN KEY ("overall_review_id") REFERENCES "public"."overall_review"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."review_suggestion_snippet"
    ADD CONSTRAINT "review_suggestion_snippet_review_feedback_id_fkey" FOREIGN KEY ("review_feedback_id") REFERENCES "public"."review_feedback"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE "public"."project" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "authenticated_users_can_delete_org_projects" ON "public"."project" FOR DELETE TO "authenticated" USING (("organization_id" IN ( SELECT "organization_member"."organization_id"
   FROM "public"."organization_member"
  WHERE ("organization_member"."user_id" = "auth"."uid"()))));



COMMENT ON POLICY "authenticated_users_can_delete_org_projects" ON "public"."project" IS 'Authenticated users can only delete projects in organizations they are members of';



CREATE POLICY "authenticated_users_can_insert_projects" ON "public"."project" FOR INSERT TO "authenticated" WITH CHECK (("organization_id" IN ( SELECT "organization_member"."organization_id"
   FROM "public"."organization_member"
  WHERE ("organization_member"."user_id" = "auth"."uid"()))));



COMMENT ON POLICY "authenticated_users_can_insert_projects" ON "public"."project" IS 'Authenticated users can create any project';



CREATE POLICY "authenticated_users_can_select_org_projects" ON "public"."project" FOR SELECT TO "authenticated" USING (("organization_id" IN ( SELECT "organization_member"."organization_id"
   FROM "public"."organization_member"
  WHERE ("organization_member"."user_id" = "auth"."uid"()))));



COMMENT ON POLICY "authenticated_users_can_select_org_projects" ON "public"."project" IS 'Authenticated users can only view projects belonging to organizations they are members of';



CREATE POLICY "authenticated_users_can_update_org_projects" ON "public"."project" FOR UPDATE TO "authenticated" USING (("organization_id" IN ( SELECT "organization_member"."organization_id"
   FROM "public"."organization_member"
  WHERE ("organization_member"."user_id" = "auth"."uid"())))) WITH CHECK (("organization_id" IN ( SELECT "organization_member"."organization_id"
   FROM "public"."organization_member"
  WHERE ("organization_member"."user_id" = "auth"."uid"()))));



COMMENT ON POLICY "authenticated_users_can_update_org_projects" ON "public"."project" IS 'Authenticated users can only update projects in organizations they are members of';



CREATE POLICY "service_role_can_delete_all_projects" ON "public"."project" FOR DELETE TO "service_role" USING (true);



COMMENT ON POLICY "service_role_can_delete_all_projects" ON "public"."project" IS 'Service role can delete any project (for jobs)';



CREATE POLICY "service_role_can_insert_all_projects" ON "public"."project" FOR INSERT TO "service_role" WITH CHECK (true);



COMMENT ON POLICY "service_role_can_insert_all_projects" ON "public"."project" IS 'Service role can create any project (for jobs)';



CREATE POLICY "service_role_can_select_all_projects" ON "public"."project" FOR SELECT TO "service_role" USING (true);



COMMENT ON POLICY "service_role_can_select_all_projects" ON "public"."project" IS 'Service role can view all projects (for jobs)';



CREATE POLICY "service_role_can_update_all_projects" ON "public"."project" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);



COMMENT ON POLICY "service_role_can_update_all_projects" ON "public"."project" IS 'Service role can update any project (for jobs)';





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_existing_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_existing_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_existing_users"() TO "service_role";


















GRANT ALL ON TABLE "public"."github_doc_file_path" TO "anon";
GRANT ALL ON TABLE "public"."github_doc_file_path" TO "authenticated";
GRANT ALL ON TABLE "public"."github_doc_file_path" TO "service_role";






GRANT ALL ON TABLE "public"."github_schema_file_path" TO "anon";
GRANT ALL ON TABLE "public"."github_schema_file_path" TO "authenticated";
GRANT ALL ON TABLE "public"."github_schema_file_path" TO "service_role";






GRANT ALL ON TABLE "public"."knowledge_suggestion" TO "anon";
GRANT ALL ON TABLE "public"."knowledge_suggestion" TO "authenticated";
GRANT ALL ON TABLE "public"."knowledge_suggestion" TO "service_role";



GRANT ALL ON TABLE "public"."knowledge_suggestion_doc_mapping" TO "anon";
GRANT ALL ON TABLE "public"."knowledge_suggestion_doc_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."knowledge_suggestion_doc_mapping" TO "service_role";









GRANT ALL ON TABLE "public"."membership_invites" TO "anon";
GRANT ALL ON TABLE "public"."membership_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_invites" TO "service_role";






GRANT ALL ON TABLE "public"."migration" TO "anon";
GRANT ALL ON TABLE "public"."migration" TO "authenticated";
GRANT ALL ON TABLE "public"."migration" TO "service_role";






GRANT ALL ON TABLE "public"."organization" TO "anon";
GRANT ALL ON TABLE "public"."organization" TO "authenticated";
GRANT ALL ON TABLE "public"."organization" TO "service_role";



GRANT ALL ON TABLE "public"."organization_member" TO "anon";
GRANT ALL ON TABLE "public"."organization_member" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_member" TO "service_role";









GRANT ALL ON TABLE "public"."overall_review" TO "anon";
GRANT ALL ON TABLE "public"."overall_review" TO "authenticated";
GRANT ALL ON TABLE "public"."overall_review" TO "service_role";



GRANT ALL ON TABLE "public"."overall_review_knowledge_suggestion_mapping" TO "anon";
GRANT ALL ON TABLE "public"."overall_review_knowledge_suggestion_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."overall_review_knowledge_suggestion_mapping" TO "service_role";









GRANT ALL ON TABLE "public"."project" TO "anon";
GRANT ALL ON TABLE "public"."project" TO "authenticated";
GRANT ALL ON TABLE "public"."project" TO "service_role";



GRANT ALL ON TABLE "public"."project_repository_mapping" TO "anon";
GRANT ALL ON TABLE "public"."project_repository_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."project_repository_mapping" TO "service_role";









GRANT ALL ON TABLE "public"."pull_request" TO "anon";
GRANT ALL ON TABLE "public"."pull_request" TO "authenticated";
GRANT ALL ON TABLE "public"."pull_request" TO "service_role";






GRANT ALL ON TABLE "public"."repository" TO "anon";
GRANT ALL ON TABLE "public"."repository" TO "authenticated";
GRANT ALL ON TABLE "public"."repository" TO "service_role";






GRANT ALL ON TABLE "public"."review_feedback" TO "anon";
GRANT ALL ON TABLE "public"."review_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."review_feedback" TO "service_role";






GRANT ALL ON TABLE "public"."review_feedback_comment" TO "anon";
GRANT ALL ON TABLE "public"."review_feedback_comment" TO "authenticated";
GRANT ALL ON TABLE "public"."review_feedback_comment" TO "service_role";









GRANT ALL ON TABLE "public"."review_suggestion_snippet" TO "anon";
GRANT ALL ON TABLE "public"."review_suggestion_snippet" TO "authenticated";
GRANT ALL ON TABLE "public"."review_suggestion_snippet" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

--
-- Dumped schema changes for auth and storage
--

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();
