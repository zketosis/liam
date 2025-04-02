-- Add missing GRANT statements for tables
GRANT ALL ON TABLE "public"."Migration" TO "anon";
GRANT ALL ON TABLE "public"."Migration" TO "authenticated";
GRANT ALL ON TABLE "public"."Migration" TO "service_role";

GRANT ALL ON TABLE "public"."OverallReview" TO "anon";
GRANT ALL ON TABLE "public"."OverallReview" TO "authenticated";
GRANT ALL ON TABLE "public"."OverallReview" TO "service_role";

GRANT ALL ON TABLE "public"."PullRequest" TO "anon";
GRANT ALL ON TABLE "public"."PullRequest" TO "authenticated";
GRANT ALL ON TABLE "public"."PullRequest" TO "service_role";

GRANT ALL ON TABLE "public"."WatchSchemaFilePattern" TO "anon";
GRANT ALL ON TABLE "public"."WatchSchemaFilePattern" TO "authenticated";
GRANT ALL ON TABLE "public"."WatchSchemaFilePattern" TO "service_role";
