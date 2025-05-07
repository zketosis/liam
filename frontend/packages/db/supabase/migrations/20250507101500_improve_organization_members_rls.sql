BEGIN;

DROP POLICY IF EXISTS "authenticated_users_can_insert_org_organization_members" ON "public"."organization_members";
DROP POLICY IF EXISTS "authenticated_users_can_delete_org_organization_members" ON "public"."organization_members";
DROP POLICY IF EXISTS "authenticated_users_can_select_org_organization_members" ON "public"."organization_members";

CREATE OR REPLACE FUNCTION is_org_member(_user uuid, _org uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = _org
      AND om.user_id = _user
  );
$$;

ALTER FUNCTION is_org_member(uuid, uuid) OWNER TO postgres;
REVOKE ALL ON FUNCTION is_org_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_org_member(uuid, uuid) TO authenticated;

CREATE POLICY "authenticated_users_can_insert_org_organization_members"
  ON "public"."organization_members"
  FOR INSERT TO "authenticated"
  WITH CHECK (
    (user_id = auth.uid()) 
    OR 
    is_org_member(auth.uid(), organization_id)
  );

CREATE POLICY "authenticated_users_can_delete_org_organization_members"
  ON "public"."organization_members"
  FOR DELETE TO "authenticated"
  USING (is_org_member(auth.uid(), organization_id));

CREATE POLICY "authenticated_users_can_select_org_organization_members"
  ON "public"."organization_members"
  FOR SELECT TO "authenticated"
  USING (is_org_member(auth.uid(), organization_id));

COMMENT ON POLICY "authenticated_users_can_insert_org_organization_members" 
  ON "public"."organization_members" 
  IS 'Authenticated users can add themselves to any organization or add members to organizations they belong to';

COMMENT ON POLICY "authenticated_users_can_delete_org_organization_members" 
  ON "public"."organization_members" 
  IS 'Authenticated users can only remove members from organizations they belong to';

COMMENT ON POLICY "authenticated_users_can_select_org_organization_members" 
  ON "public"."organization_members" 
  IS 'Authenticated users can only view members of organizations they belong to';

COMMIT;
