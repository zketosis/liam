revoke delete on table "public"."Project" from "anon";

revoke insert on table "public"."Project" from "anon";

revoke references on table "public"."Project" from "anon";

revoke select on table "public"."Project" from "anon";

revoke trigger on table "public"."Project" from "anon";

revoke truncate on table "public"."Project" from "anon";

revoke update on table "public"."Project" from "anon";

revoke delete on table "public"."Project" from "authenticated";

revoke insert on table "public"."Project" from "authenticated";

revoke references on table "public"."Project" from "authenticated";

revoke select on table "public"."Project" from "authenticated";

revoke trigger on table "public"."Project" from "authenticated";

revoke truncate on table "public"."Project" from "authenticated";

revoke update on table "public"."Project" from "authenticated";

revoke delete on table "public"."Project" from "service_role";

revoke insert on table "public"."Project" from "service_role";

revoke references on table "public"."Project" from "service_role";

revoke select on table "public"."Project" from "service_role";

revoke trigger on table "public"."Project" from "service_role";

revoke truncate on table "public"."Project" from "service_role";

revoke update on table "public"."Project" from "service_role";

alter table "public"."OverallReview" add column "branchName" text not null;


