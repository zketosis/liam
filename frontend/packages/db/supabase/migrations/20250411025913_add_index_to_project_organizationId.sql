BEGIN;

create index if not exists "idx_project_organizationId" on "public"."Project" ("organizationId");

COMMIT;
