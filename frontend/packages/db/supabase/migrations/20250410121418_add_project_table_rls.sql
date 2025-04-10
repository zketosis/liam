ALTER TABLE "public"."Project" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_users_can_select_org_projects" ON "public"."Project"
FOR SELECT
TO authenticated
USING (
  organizationId IN (
    SELECT "organizationId" 
    FROM "public"."OrganizationMember" 
    WHERE "userId" = auth.uid()
  )
);

CREATE POLICY "service_role_can_select_all_projects" ON "public"."Project"
FOR SELECT
TO service_role
USING (true);

COMMENT ON POLICY "authenticated_users_can_select_org_projects" ON "public"."Project" IS 'Authenticated users can only view projects belonging to organizations they are members of';
COMMENT ON POLICY "service_role_can_select_all_projects" ON "public"."Project" IS 'Service role can view all projects (for jobs)';
