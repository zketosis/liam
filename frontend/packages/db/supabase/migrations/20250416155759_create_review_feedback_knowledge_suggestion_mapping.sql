create table "public"."ReviewFeedbackKnowledgeSuggestionMapping" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reviewFeedbackId" "uuid" references "ReviewFeedback",
    "knowledgeSuggestionId" "uuid" references "KnowledgeSuggestion",
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);

GRANT ALL ON TABLE "public"."ReviewFeedbackKnowledgeSuggestionMapping" TO "anon";
GRANT ALL ON TABLE "public"."ReviewFeedbackKnowledgeSuggestionMapping" TO "authenticated";
GRANT ALL ON TABLE "public"."ReviewFeedbackKnowledgeSuggestionMapping" TO "service_role";

