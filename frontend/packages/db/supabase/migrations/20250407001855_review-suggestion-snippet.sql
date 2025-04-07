CREATE SEQUENCE IF NOT EXISTS "public"."ReviewSuggestionSnippet_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS "public"."ReviewSuggestionSnippet" (
    "id" integer NOT NULL DEFAULT nextval('"public"."ReviewSuggestionSnippet_id_seq"'::regclass),
    "reviewIssueId" integer NOT NULL,
    "filename" text NOT NULL,
    "snippet" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT "ReviewSuggestionSnippet_pkey" PRIMARY KEY ("id")
);

ALTER TABLE ONLY "public"."ReviewSuggestionSnippet"
    ADD CONSTRAINT "ReviewSuggestionSnippet_reviewIssueId_fkey" FOREIGN KEY ("reviewIssueId")
        REFERENCES "public"."ReviewIssue"("id")
        ON UPDATE CASCADE ON DELETE CASCADE;

GRANT ALL ON TABLE "public"."ReviewSuggestionSnippet" TO "anon";
GRANT ALL ON TABLE "public"."ReviewSuggestionSnippet" TO "authenticated";
GRANT ALL ON TABLE "public"."ReviewSuggestionSnippet" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ReviewSuggestionSnippet_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ReviewSuggestionSnippet_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ReviewSuggestionSnippet_id_seq" TO "service_role";
