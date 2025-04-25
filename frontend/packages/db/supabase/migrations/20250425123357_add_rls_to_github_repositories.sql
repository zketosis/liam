BEGIN;

ALTER TABLE "public"."github_repositories" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_users_can_select_org_github_repositories" 
  ON "public"."github_repositories" 
  FOR SELECT TO "authenticated" 
  USING (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  )));

COMMENT ON POLICY "authenticated_users_can_select_org_github_repositories" 
  ON "public"."github_repositories" 
  IS 'Authenticated users can only view repositories belonging to organizations they are members of';

CREATE POLICY "authenticated_users_can_insert_org_github_repositories" 
  ON "public"."github_repositories" 
  FOR INSERT TO "authenticated" 
  WITH CHECK (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  )));

COMMENT ON POLICY "authenticated_users_can_insert_org_github_repositories" 
  ON "public"."github_repositories" 
  IS 'Authenticated users can only create repositories in organizations they are members of';

CREATE POLICY "authenticated_users_can_update_org_github_repositories" 
  ON "public"."github_repositories" 
  FOR UPDATE TO "authenticated" 
  USING (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  ))) 
  WITH CHECK (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  )));

COMMENT ON POLICY "authenticated_users_can_update_org_github_repositories" 
  ON "public"."github_repositories" 
  IS 'Authenticated users can only update repositories in organizations they are members of';

CREATE POLICY "authenticated_users_can_delete_org_github_repositories" 
  ON "public"."github_repositories" 
  FOR DELETE TO "authenticated" 
  USING (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  )));

COMMENT ON POLICY "authenticated_users_can_delete_org_github_repositories" 
  ON "public"."github_repositories" 
  IS 'Authenticated users can only delete repositories in organizations they are members of';

CREATE POLICY "service_role_can_select_all_github_repositories" 
  ON "public"."github_repositories" 
  FOR SELECT TO "service_role" 
  USING (true);

CREATE POLICY "service_role_can_insert_all_github_repositories" 
  ON "public"."github_repositories" 
  FOR INSERT TO "service_role" 
  WITH CHECK (true);

CREATE POLICY "service_role_can_update_all_github_repositories" 
  ON "public"."github_repositories" 
  FOR UPDATE TO "service_role" 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "service_role_can_delete_all_github_repositories" 
  ON "public"."github_repositories" 
  FOR DELETE TO "service_role" 
  USING (true);

COMMIT;
