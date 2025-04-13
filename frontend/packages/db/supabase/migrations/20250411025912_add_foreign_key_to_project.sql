BEGIN;

alter table "public"."Project" add constraint "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization" (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."Project" validate constraint "Project_organizationId_fkey";

COMMIT;
