create sequence "public"."ReviewFeedbackKnowledgeSuggestionMapping_id_seq";

create table "public"."ReviewFeedbackKnowledgeSuggestionMapping" (
    "id" integer not null default nextval('"ReviewFeedbackKnowledgeSuggestionMapping_id_seq"'::regclass),
    "reviewFeedbackId" integer not null,
    "knowledgeSuggestionId" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);

alter sequence "public"."ReviewFeedbackKnowledgeSuggestionMapping_id_seq" owned by "public"."ReviewFeedbackKnowledgeSuggestionMapping"."id";

CREATE UNIQUE INDEX "ReviewFeedbackKnowledgeSuggestionMapping_pkey" ON public."ReviewFeedbackKnowledgeSuggestionMapping" USING btree (id);

CREATE UNIQUE INDEX "ReviewFeedbackKnowledgeSuggestionMapping_reviewFeedbackId_knowledgeSuggestionId_key" ON public."ReviewFeedbackKnowledgeSuggestionMapping" USING btree ("reviewFeedbackId", "knowledgeSuggestionId");

alter table "public"."ReviewFeedbackKnowledgeSuggestionMapping" add constraint "ReviewFeedbackKnowledgeSuggestionMapping_pkey" PRIMARY KEY using index "ReviewFeedbackKnowledgeSuggestionMapping_pkey";

alter table "public"."ReviewFeedbackKnowledgeSuggestionMapping" add constraint "ReviewFeedbackKnowledgeSuggestionMapping_reviewFeedbackId_fkey" FOREIGN KEY ("reviewFeedbackId") REFERENCES "ReviewFeedback"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;
alter table "public"."ReviewFeedbackKnowledgeSuggestionMapping" validate constraint "ReviewFeedbackKnowledgeSuggestionMapping_reviewFeedbackId_fkey";

alter table "public"."ReviewFeedbackKnowledgeSuggestionMapping" add constraint "ReviewFeedbackKnowledgeSuggestionMapping_knowledgeSuggestionId_fkey" FOREIGN KEY ("knowledgeSuggestionId") REFERENCES "KnowledgeSuggestion"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;
alter table "public"."ReviewFeedbackKnowledgeSuggestionMapping" validate constraint "ReviewFeedbackKnowledgeSuggestionMapping_knowledgeSuggestionId_fkey";

-- Grant permissions
GRANT ALL ON TABLE "public"."ReviewFeedbackKnowledgeSuggestionMapping" TO "anon";
GRANT ALL ON TABLE "public"."ReviewFeedbackKnowledgeSuggestionMapping" TO "authenticated";
GRANT ALL ON TABLE "public"."ReviewFeedbackKnowledgeSuggestionMapping" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ReviewFeedbackKnowledgeSuggestionMapping_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ReviewFeedbackKnowledgeSuggestionMapping_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ReviewFeedbackKnowledgeSuggestionMapping_id_seq" TO "service_role";
