create type "public"."CategoryEnum" as enum ('MIGRATION_SAFETY', 'DATA_INTEGRITY', 'PERFORMANCE_IMPACT', 'PROJECT_RULES_CONSISTENCY', 'SECURITY_OR_SCALABILITY');

create type "public"."SeverityEnum" as enum ('CRITICAL', 'WARNING', 'POSITIVE');

create sequence "public"."ReviewIssue_id_seq";

create sequence "public"."ReviewScore_id_seq";

create table "public"."ReviewIssue" (
    "id" integer not null default nextval('"ReviewIssue_id_seq"'::regclass),
    "overallReviewId" integer not null,
    "overallScore" integer not null,
    "category" "CategoryEnum" not null,
    "severity" "SeverityEnum" not null,
    "description" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


create table "public"."ReviewScore" (
    "id" integer not null default nextval('"ReviewScore_id_seq"'::regclass),
    "overallReviewId" integer not null,
    "overallScore" integer not null,
    "category" "CategoryEnum" not null,
    "reason" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


alter sequence "public"."ReviewIssue_id_seq" owned by "public"."ReviewIssue"."id";

alter sequence "public"."ReviewScore_id_seq" owned by "public"."ReviewScore"."id";

CREATE UNIQUE INDEX "ReviewIssue_pkey" ON public."ReviewIssue" USING btree (id);

CREATE UNIQUE INDEX "ReviewScore_pkey" ON public."ReviewScore" USING btree (id);

alter table "public"."ReviewIssue" add constraint "ReviewIssue_pkey" PRIMARY KEY using index "ReviewIssue_pkey";

alter table "public"."ReviewScore" add constraint "ReviewScore_pkey" PRIMARY KEY using index "ReviewScore_pkey";

alter table "public"."ReviewIssue" add constraint "ReviewIssue_overallReviewId_fkey" FOREIGN KEY ("overallReviewId") REFERENCES "OverallReview"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ReviewIssue" validate constraint "ReviewIssue_overallReviewId_fkey";

alter table "public"."ReviewScore" add constraint "ReviewScore_overallReviewId_fkey" FOREIGN KEY ("overallReviewId") REFERENCES "OverallReview"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ReviewScore" validate constraint "ReviewScore_overallReviewId_fkey";
