-- Create a new intermediate table to link KnowledgeSuggestion and GitHubDocFilePath
create sequence "public"."KnowledgeSuggestionDocMapping_id_seq";

create table "public"."KnowledgeSuggestionDocMapping" (
    "id" integer not null default nextval('"KnowledgeSuggestionDocMapping_id_seq"'::regclass),
    "knowledgeSuggestionId" integer not null,
    "gitHubDocFilePathId" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);

alter sequence "public"."KnowledgeSuggestionDocMapping_id_seq" owned by "public"."KnowledgeSuggestionDocMapping"."id";

-- Create indexes
CREATE UNIQUE INDEX "KnowledgeSuggestionDocMapping_pkey" ON public."KnowledgeSuggestionDocMapping" USING btree (id);
CREATE UNIQUE INDEX "KnowledgeSuggestionDocMapping_unique_mapping" ON public."KnowledgeSuggestionDocMapping" USING btree ("knowledgeSuggestionId", "gitHubDocFilePathId");

-- Add constraints
alter table "public"."KnowledgeSuggestionDocMapping" add constraint "KnowledgeSuggestionDocMapping_pkey" PRIMARY KEY using index "KnowledgeSuggestionDocMapping_pkey";

alter table "public"."KnowledgeSuggestionDocMapping" add constraint "KnowledgeSuggestionDocMapping_knowledgeSuggestionId_fkey" FOREIGN KEY ("knowledgeSuggestionId") REFERENCES "KnowledgeSuggestion"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."KnowledgeSuggestionDocMapping" validate constraint "KnowledgeSuggestionDocMapping_knowledgeSuggestionId_fkey";

alter table "public"."KnowledgeSuggestionDocMapping" add constraint "KnowledgeSuggestionDocMapping_gitHubDocFilePathId_fkey" FOREIGN KEY ("gitHubDocFilePathId") REFERENCES "GitHubDocFilePath"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."KnowledgeSuggestionDocMapping" validate constraint "KnowledgeSuggestionDocMapping_gitHubDocFilePathId_fkey";

-- Grant permissions
GRANT ALL ON TABLE "public"."KnowledgeSuggestionDocMapping" TO "anon";
GRANT ALL ON TABLE "public"."KnowledgeSuggestionDocMapping" TO "authenticated";
GRANT ALL ON TABLE "public"."KnowledgeSuggestionDocMapping" TO "service_role";

GRANT ALL ON SEQUENCE "public"."KnowledgeSuggestionDocMapping_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."KnowledgeSuggestionDocMapping_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."KnowledgeSuggestionDocMapping_id_seq" TO "service_role";
