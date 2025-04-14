-- Add a new table for comments on ReviewFeedback items
BEGIN;

-- Create the ReviewFeedbackComment table
CREATE TABLE IF NOT EXISTS "public"."ReviewFeedbackComment" (
    "id" integer NOT NULL,
    "reviewFeedbackId" integer NOT NULL,
    "userId" uuid NOT NULL,
    "content" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

-- Create sequence for the id column
CREATE SEQUENCE IF NOT EXISTS "public"."ReviewFeedbackComment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set the default value for the id column
ALTER TABLE ONLY "public"."ReviewFeedbackComment" ALTER COLUMN "id" SET DEFAULT nextval('"public"."ReviewFeedbackComment_id_seq"'::regclass);

-- Add primary key constraint
ALTER TABLE ONLY "public"."ReviewFeedbackComment"
    ADD CONSTRAINT "ReviewFeedbackComment_pkey" PRIMARY KEY ("id");

-- Add foreign key constraints
ALTER TABLE ONLY "public"."ReviewFeedbackComment"
    ADD CONSTRAINT "ReviewFeedbackComment_reviewFeedbackId_fkey" FOREIGN KEY ("reviewFeedbackId") REFERENCES "public"."ReviewFeedback"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."ReviewFeedbackComment"
    ADD CONSTRAINT "ReviewFeedbackComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- Grant permissions
GRANT ALL ON TABLE "public"."ReviewFeedbackComment" TO "anon";
GRANT ALL ON TABLE "public"."ReviewFeedbackComment" TO "authenticated";
GRANT ALL ON TABLE "public"."ReviewFeedbackComment" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ReviewFeedbackComment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ReviewFeedbackComment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ReviewFeedbackComment_id_seq" TO "service_role";

-- Create an index for faster lookups by reviewFeedbackId
CREATE INDEX "idx_review_feedback_comment_review_feedback_id" ON "public"."ReviewFeedbackComment" USING btree ("reviewFeedbackId");

COMMIT;
