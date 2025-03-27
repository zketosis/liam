create sequence "public"."GitHubDocFilePath_id_seq";

create table "public"."GitHubDocFilePath" (
    "id" integer not null default nextval('"GitHubDocFilePath_id_seq"'::regclass),
    "path" text not null,
    "isReviewEnabled" boolean not null default true,
    "projectId" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


alter sequence "public"."GitHubDocFilePath_id_seq" owned by "public"."GitHubDocFilePath"."id";

CREATE UNIQUE INDEX "GitHubDocFilePath_pkey" ON public."GitHubDocFilePath" USING btree (id);

alter table "public"."GitHubDocFilePath" add constraint "GitHubDocFilePath_pkey" PRIMARY KEY using index "GitHubDocFilePath_pkey";

alter table "public"."GitHubDocFilePath" add constraint "GitHubDocFilePath_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."GitHubDocFilePath" validate constraint "GitHubDocFilePath_projectId_fkey";
