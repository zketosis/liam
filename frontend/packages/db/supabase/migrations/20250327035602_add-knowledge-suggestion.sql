create type "public"."KnowledgeType" as enum ('SCHEMA', 'DOCS');

create sequence "public"."KnowledgeSuggestion_id_seq";

create table "public"."KnowledgeSuggestion" (
    "id" integer not null default nextval('"KnowledgeSuggestion_id_seq"'::regclass),
    "type" "KnowledgeType" not null,
    "title" text not null,
    "path" text not null,
    "content" text not null,
    "fileSha" text not null,
    "projectId" integer not null,
    "approvedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


alter sequence "public"."KnowledgeSuggestion_id_seq" owned by "public"."KnowledgeSuggestion"."id";

CREATE UNIQUE INDEX "KnowledgeSuggestion_pkey" ON public."KnowledgeSuggestion" USING btree (id);

alter table "public"."KnowledgeSuggestion" add constraint "KnowledgeSuggestion_pkey" PRIMARY KEY using index "KnowledgeSuggestion_pkey";

alter table "public"."KnowledgeSuggestion" add constraint "KnowledgeSuggestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."KnowledgeSuggestion" validate constraint "KnowledgeSuggestion_projectId_fkey";
