BEGIN;

ALTER TABLE "public"."github_pull_request_comments" ADD COLUMN "organization_id" UUID;

UPDATE "public"."github_pull_request_comments" gpc
SET "organization_id" = (
  SELECT pr."organization_id"
  FROM "public"."github_pull_requests" pr
  WHERE pr."id" = gpc."github_pull_request_id"
  LIMIT 1
);

ALTER TABLE "public"."github_pull_request_comments" 
  ALTER COLUMN "organization_id" SET NOT NULL;

ALTER TABLE "public"."github_pull_request_comments" 
  ADD CONSTRAINT "github_pull_request_comments_organization_id_fkey" 
  FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") 
  ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE OR REPLACE FUNCTION "public"."set_github_pull_request_comments_organization_id"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  NEW.organization_id := (
    SELECT pr."organization_id" 
    FROM "public"."github_pull_requests" pr
    WHERE pr."id" = NEW.github_pull_request_id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER "set_github_pull_request_comments_organization_id_trigger"
  BEFORE INSERT OR UPDATE ON "public"."github_pull_request_comments"
  FOR EACH ROW
  EXECUTE FUNCTION "public"."set_github_pull_request_comments_organization_id"();

ALTER TABLE "public"."github_pull_request_comments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_users_can_select_org_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  FOR SELECT TO "authenticated" 
  USING (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  )));

COMMENT ON POLICY "authenticated_users_can_select_org_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  IS 'Authenticated users can only view pull request comments belonging to organizations they are members of';

CREATE POLICY "authenticated_users_can_insert_org_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  FOR INSERT TO "authenticated" 
  WITH CHECK (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  )));

COMMENT ON POLICY "authenticated_users_can_insert_org_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  IS 'Authenticated users can only create pull request comments in organizations they are members of';

CREATE POLICY "authenticated_users_can_update_org_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
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

COMMENT ON POLICY "authenticated_users_can_update_org_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  IS 'Authenticated users can only update pull request comments in organizations they are members of';

CREATE POLICY "service_role_can_select_all_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  FOR SELECT TO "service_role" 
  USING (true);

CREATE POLICY "service_role_can_insert_all_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  FOR INSERT TO "service_role" 
  WITH CHECK (true);

CREATE POLICY "service_role_can_update_all_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  FOR UPDATE TO "service_role" 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "service_role_can_delete_all_github_pull_request_comments" 
  ON "public"."github_pull_request_comments" 
  FOR DELETE TO "service_role" 
  USING (true);

COMMIT;
