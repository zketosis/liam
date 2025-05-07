
BEGIN;

DROP POLICY IF EXISTS "authenticated_users_can_insert_org_organization_members" ON "public"."organization_members";

CREATE POLICY "authenticated_users_can_insert_org_organization_members"
  ON "public"."organization_members"
  FOR INSERT TO "authenticated"
  WITH CHECK (true);

COMMENT ON POLICY "authenticated_users_can_insert_org_organization_members" 
  ON "public"."organization_members" 
  IS 'Authenticated users can add members to any organization';

COMMIT;
