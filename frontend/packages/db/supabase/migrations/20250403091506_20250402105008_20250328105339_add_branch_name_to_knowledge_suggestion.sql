create sequence "public"."WatchSchemaFilePattern_id_seq";

alter table "public"."GitHubSchemaFilePath" drop constraint "GitHubSchemaFilePath_path_projectId_key";

alter table "public"."GitHubSchemaFilePath" drop constraint "GitHubSchemaFilePath_projectId_fkey";

alter table "public"."GitHubSchemaFilePath" drop constraint "GitHubSchemaFilePath_pkey";

drop index if exists "public"."GitHubSchemaFilePath_path_projectId_key";

drop index if exists "public"."GitHubSchemaFilePath_pkey";

drop table "public"."GitHubSchemaFilePath";

create table "public"."WatchSchemaFilePattern" (
    "id" integer not null default nextval('"WatchSchemaFilePattern_id_seq"'::regclass),
    "pattern" text not null,
    "projectId" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


alter table "public"."ReviewIssue" add column "overallScore" integer not null;

alter sequence "public"."WatchSchemaFilePattern_id_seq" owned by "public"."WatchSchemaFilePattern"."id";

drop sequence if exists "public"."GitHubSchemaFilePath_id_seq";

CREATE UNIQUE INDEX "WatchSchemaFilePattern_pkey" ON public."WatchSchemaFilePattern" USING btree (id);

alter table "public"."WatchSchemaFilePattern" add constraint "WatchSchemaFilePattern_pkey" PRIMARY KEY using index "WatchSchemaFilePattern_pkey";

alter table "public"."WatchSchemaFilePattern" add constraint "WatchSchemaFilePattern_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."WatchSchemaFilePattern" validate constraint "WatchSchemaFilePattern_projectId_fkey";

grant delete on table "public"."WatchSchemaFilePattern" to "anon";

grant insert on table "public"."WatchSchemaFilePattern" to "anon";

grant references on table "public"."WatchSchemaFilePattern" to "anon";

grant select on table "public"."WatchSchemaFilePattern" to "anon";

grant trigger on table "public"."WatchSchemaFilePattern" to "anon";

grant truncate on table "public"."WatchSchemaFilePattern" to "anon";

grant update on table "public"."WatchSchemaFilePattern" to "anon";

grant delete on table "public"."WatchSchemaFilePattern" to "authenticated";

grant insert on table "public"."WatchSchemaFilePattern" to "authenticated";

grant references on table "public"."WatchSchemaFilePattern" to "authenticated";

grant select on table "public"."WatchSchemaFilePattern" to "authenticated";

grant trigger on table "public"."WatchSchemaFilePattern" to "authenticated";

grant truncate on table "public"."WatchSchemaFilePattern" to "authenticated";

grant update on table "public"."WatchSchemaFilePattern" to "authenticated";

grant delete on table "public"."WatchSchemaFilePattern" to "service_role";

grant insert on table "public"."WatchSchemaFilePattern" to "service_role";

grant references on table "public"."WatchSchemaFilePattern" to "service_role";

grant select on table "public"."WatchSchemaFilePattern" to "service_role";

grant trigger on table "public"."WatchSchemaFilePattern" to "service_role";

grant truncate on table "public"."WatchSchemaFilePattern" to "service_role";

grant update on table "public"."WatchSchemaFilePattern" to "service_role";


