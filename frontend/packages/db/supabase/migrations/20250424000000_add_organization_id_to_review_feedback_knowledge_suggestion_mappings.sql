BEGIN;

ALTER TABLE "public"."review_feedback_knowledge_suggestion_mappings" ADD COLUMN "organization_id" UUID;

UPDATE "public"."review_feedback_knowledge_suggestion_mappings" rfksm
SET "organization_id" = (
  CASE
    WHEN rfksm."knowledge_suggestion_id" IS NOT NULL THEN
      (SELECT ks."organization_id"
       FROM "public"."knowledge_suggestions" ks
       WHERE ks."id" = rfksm."knowledge_suggestion_id"
       LIMIT 1)
    WHEN rfksm."review_feedback_id" IS NOT NULL THEN
      (SELECT p."organization_id"
       FROM "public"."review_feedbacks" rf
       JOIN "public"."overall_reviews" orv ON rf."overall_review_id" = orv."id"
       JOIN "public"."projects" p ON orv."project_id" = p."id"
       WHERE rf."id" = rfksm."review_feedback_id"
       LIMIT 1)
    ELSE NULL
  END
);

ALTER TABLE "public"."review_feedback_knowledge_suggestion_mappings" 
  ALTER COLUMN "organization_id" SET NOT NULL;

ALTER TABLE "public"."review_feedback_knowledge_suggestion_mappings" 
  ADD CONSTRAINT "review_feedback_knowledge_suggestion_mappings_organization_id_fkey" 
  FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") 
  ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE OR REPLACE FUNCTION "public"."set_review_feedback_knowledge_suggestion_mappings_organization_id"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF NEW.knowledge_suggestion_id IS NOT NULL THEN
    NEW.organization_id := (
      SELECT "organization_id" 
      FROM "public"."knowledge_suggestions" 
      WHERE "id" = NEW.knowledge_suggestion_id
    );
  ELSIF NEW.review_feedback_id IS NOT NULL THEN
    NEW.organization_id := (
      SELECT p."organization_id"
      FROM "public"."review_feedbacks" rf
      JOIN "public"."overall_reviews" orv ON rf."overall_review_id" = orv."id"
      JOIN "public"."projects" p ON orv."project_id" = p."id"
      WHERE rf."id" = NEW.review_feedback_id
    );
  ELSE
    RAISE EXCEPTION 'Either knowledge_suggestion_id or review_feedback_id must be provided';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER "set_review_feedback_knowledge_suggestion_mappings_organization_id_trigger"
  BEFORE INSERT OR UPDATE ON "public"."review_feedback_knowledge_suggestion_mappings"
  FOR EACH ROW
  EXECUTE FUNCTION "public"."set_review_feedback_knowledge_suggestion_mappings_organization_id"();

ALTER TABLE "public"."review_feedback_knowledge_suggestion_mappings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_users_can_select_org_review_feedback_knowledge_suggestion_mappings" 
  ON "public"."review_feedback_knowledge_suggestion_mappings" 
  FOR SELECT TO "authenticated" 
  USING (("organization_id" IN ( 
    SELECT "organization_members"."organization_id"
    FROM "public"."organization_members"
    WHERE ("organization_members"."user_id" = "auth"."uid"())
  )));

CREATE POLICY "service_role_can_select_all_review_feedback_knowledge_suggestion_mappings" 
  ON "public"."review_feedback_knowledge_suggestion_mappings" 
  FOR SELECT TO "service_role" 
  USING (true);

CREATE POLICY "service_role_can_insert_all_review_feedback_knowledge_suggestion_mappings" 
  ON "public"."review_feedback_knowledge_suggestion_mappings" 
  FOR INSERT TO "service_role" 
  WITH CHECK (true);

COMMIT;
