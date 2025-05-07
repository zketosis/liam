BEGIN;

DROP POLICY IF EXISTS "authenticated_users_can_insert_org_organization_members" ON "public"."organization_members";
DROP POLICY IF EXISTS "authenticated_users_can_delete_org_organization_members" ON "public"."organization_members";
DROP POLICY IF EXISTS "authenticated_users_can_select_org_organization_members" ON "public"."organization_members";

CREATE POLICY "authenticated_users_can_insert_org_organization_members"
  ON "public"."organization_members"
  FOR INSERT TO "authenticated"
  WITH CHECK (true);

CREATE POLICY "authenticated_users_can_delete_org_organization_members"
  ON "public"."organization_members"
  FOR DELETE TO "authenticated"
  USING (true);

CREATE POLICY "authenticated_users_can_select_org_organization_members"
  ON "public"."organization_members"
  FOR SELECT TO "authenticated"
  USING (true);

COMMENT ON POLICY "authenticated_users_can_insert_org_organization_members" 
  ON "public"."organization_members" 
  IS 'Authenticated users can add members to any organization';

COMMENT ON POLICY "authenticated_users_can_delete_org_organization_members" 
  ON "public"."organization_members" 
  IS 'Authenticated users can remove members from any organization';

COMMENT ON POLICY "authenticated_users_can_select_org_organization_members" 
  ON "public"."organization_members" 
  IS 'Authenticated users can view members of any organization';

COMMIT;
