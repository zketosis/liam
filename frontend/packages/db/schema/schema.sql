--
--


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE "public"."Project" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_users_can_select_org_projects" ON "public"."Project"
FOR SELECT
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" 
    FROM "public"."OrganizationMember" 
    WHERE "userId" = auth.uid()
  )
);

CREATE POLICY "authenticated_users_can_insert_projects" ON "public"."Project"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_update_org_projects" ON "public"."Project"
FOR UPDATE
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" 
    FROM "public"."OrganizationMember" 
    WHERE "userId" = auth.uid()
  )
)
WITH CHECK (
  "organizationId" IN (
    SELECT "organizationId" 
    FROM "public"."OrganizationMember" 
    WHERE "userId" = auth.uid()
  )
);

CREATE POLICY "authenticated_users_can_delete_org_projects" ON "public"."Project"
FOR DELETE
TO authenticated
USING (
  "organizationId" IN (
    SELECT "organizationId" 
    FROM "public"."OrganizationMember" 
    WHERE "userId" = auth.uid()
  )
);

CREATE POLICY "service_role_can_select_all_projects" ON "public"."Project"
FOR SELECT
TO service_role
USING (true);

CREATE POLICY "service_role_can_insert_all_projects" ON "public"."Project"
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "service_role_can_update_all_projects" ON "public"."Project"
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "service_role_can_delete_all_projects" ON "public"."Project"
FOR DELETE
TO service_role
USING (true);

COMMENT ON POLICY "authenticated_users_can_select_org_projects" ON "public"."Project" IS 'Authenticated users can only view projects belonging to organizations they are members of';
COMMENT ON POLICY "authenticated_users_can_insert_projects" ON "public"."Project" IS 'Authenticated users can create any project';
COMMENT ON POLICY "authenticated_users_can_update_org_projects" ON "public"."Project" IS 'Authenticated users can only update projects in organizations they are members of';
COMMENT ON POLICY "authenticated_users_can_delete_org_projects" ON "public"."Project" IS 'Authenticated users can only delete projects in organizations they are members of';
COMMENT ON POLICY "service_role_can_select_all_projects" ON "public"."Project" IS 'Service role can view all projects (for jobs)';
COMMENT ON POLICY "service_role_can_insert_all_projects" ON "public"."Project" IS 'Service role can create any project (for jobs)';
COMMENT ON POLICY "service_role_can_update_all_projects" ON "public"."Project" IS 'Service role can update any project (for jobs)';
COMMENT ON POLICY "service_role_can_delete_all_projects" ON "public"."Project" IS 'Service role can delete any project (for jobs)';


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";
