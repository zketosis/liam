create sequence "public"."DocVersion_id_seq";

create sequence "public"."Doc_id_seq";

revoke delete on table "public"."WatchSchemaFilePattern" from "anon";

revoke insert on table "public"."WatchSchemaFilePattern" from "anon";

revoke references on table "public"."WatchSchemaFilePattern" from "anon";

revoke select on table "public"."WatchSchemaFilePattern" from "anon";

revoke trigger on table "public"."WatchSchemaFilePattern" from "anon";

revoke truncate on table "public"."WatchSchemaFilePattern" from "anon";

revoke update on table "public"."WatchSchemaFilePattern" from "anon";

revoke delete on table "public"."WatchSchemaFilePattern" from "authenticated";

revoke insert on table "public"."WatchSchemaFilePattern" from "authenticated";

revoke references on table "public"."WatchSchemaFilePattern" from "authenticated";

revoke select on table "public"."WatchSchemaFilePattern" from "authenticated";

revoke trigger on table "public"."WatchSchemaFilePattern" from "authenticated";

revoke truncate on table "public"."WatchSchemaFilePattern" from "authenticated";

revoke update on table "public"."WatchSchemaFilePattern" from "authenticated";

revoke delete on table "public"."WatchSchemaFilePattern" from "service_role";

revoke insert on table "public"."WatchSchemaFilePattern" from "service_role";

revoke references on table "public"."WatchSchemaFilePattern" from "service_role";

revoke select on table "public"."WatchSchemaFilePattern" from "service_role";

revoke trigger on table "public"."WatchSchemaFilePattern" from "service_role";

revoke truncate on table "public"."WatchSchemaFilePattern" from "service_role";

revoke update on table "public"."WatchSchemaFilePattern" from "service_role";

alter table "public"."OverallReview" drop constraint "OverallReview_projectId_fkey";

create table "public"."Doc" (
    "id" integer not null default nextval('"Doc_id_seq"'::regclass),
    "title" text not null,
    "content" text not null,
    "latestVersionId" integer,
    "projectId" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


create table "public"."DocVersion" (
    "id" integer not null default nextval('"DocVersion_id_seq"'::regclass),
    "docId" integer not null,
    "version" integer not null,
    "content" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."OverallReview" alter column "projectId" drop not null;

alter sequence "public"."DocVersion_id_seq" owned by "public"."DocVersion"."id";

alter sequence "public"."Doc_id_seq" owned by "public"."Doc"."id";

CREATE UNIQUE INDEX "DocVersion_docId_version_key" ON public."DocVersion" USING btree ("docId", version);

CREATE UNIQUE INDEX "DocVersion_pkey" ON public."DocVersion" USING btree (id);

CREATE UNIQUE INDEX "Doc_pkey" ON public."Doc" USING btree (id);

alter table "public"."Doc" add constraint "Doc_pkey" PRIMARY KEY using index "Doc_pkey";

alter table "public"."DocVersion" add constraint "DocVersion_pkey" PRIMARY KEY using index "DocVersion_pkey";

alter table "public"."Doc" add constraint "Doc_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Doc" validate constraint "Doc_projectId_fkey";

alter table "public"."DocVersion" add constraint "DocVersion_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."DocVersion" validate constraint "DocVersion_docId_fkey";

alter table "public"."OverallReview" add constraint "OverallReview_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."OverallReview" validate constraint "OverallReview_projectId_fkey";


