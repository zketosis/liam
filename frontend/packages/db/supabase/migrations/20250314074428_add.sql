create sequence "public"."ProjectRepositoryMapping_id_seq";

revoke delete on table "public"."OverallReview" from "anon";

revoke insert on table "public"."OverallReview" from "anon";

revoke references on table "public"."OverallReview" from "anon";

revoke select on table "public"."OverallReview" from "anon";

revoke trigger on table "public"."OverallReview" from "anon";

revoke truncate on table "public"."OverallReview" from "anon";

revoke update on table "public"."OverallReview" from "anon";

revoke delete on table "public"."OverallReview" from "authenticated";

revoke insert on table "public"."OverallReview" from "authenticated";

revoke references on table "public"."OverallReview" from "authenticated";

revoke select on table "public"."OverallReview" from "authenticated";

revoke trigger on table "public"."OverallReview" from "authenticated";

revoke truncate on table "public"."OverallReview" from "authenticated";

revoke update on table "public"."OverallReview" from "authenticated";

revoke delete on table "public"."OverallReview" from "service_role";

revoke insert on table "public"."OverallReview" from "service_role";

revoke references on table "public"."OverallReview" from "service_role";

revoke select on table "public"."OverallReview" from "service_role";

revoke trigger on table "public"."OverallReview" from "service_role";

revoke truncate on table "public"."OverallReview" from "service_role";

revoke update on table "public"."OverallReview" from "service_role";

create table "public"."ProjectRepositoryMapping" (
    "id" integer not null default nextval('"ProjectRepositoryMapping_id_seq"'::regclass),
    "projectId" integer not null,
    "repositoryId" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


alter sequence "public"."ProjectRepositoryMapping_id_seq" owned by "public"."ProjectRepositoryMapping"."id";

CREATE UNIQUE INDEX "ProjectRepositoryMapping_pkey" ON public."ProjectRepositoryMapping" USING btree (id);

CREATE UNIQUE INDEX "ProjectRepositoryMapping_projectId_repositoryId_key" ON public."ProjectRepositoryMapping" USING btree ("projectId", "repositoryId");

alter table "public"."ProjectRepositoryMapping" add constraint "ProjectRepositoryMapping_pkey" PRIMARY KEY using index "ProjectRepositoryMapping_pkey";

alter table "public"."ProjectRepositoryMapping" add constraint "ProjectRepositoryMapping_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ProjectRepositoryMapping" validate constraint "ProjectRepositoryMapping_projectId_fkey";

alter table "public"."ProjectRepositoryMapping" add constraint "ProjectRepositoryMapping_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ProjectRepositoryMapping" validate constraint "ProjectRepositoryMapping_repositoryId_fkey";


