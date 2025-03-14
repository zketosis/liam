revoke delete on table "public"."ProjectRepositoryMapping" from "anon";

revoke insert on table "public"."ProjectRepositoryMapping" from "anon";

revoke references on table "public"."ProjectRepositoryMapping" from "anon";

revoke select on table "public"."ProjectRepositoryMapping" from "anon";

revoke trigger on table "public"."ProjectRepositoryMapping" from "anon";

revoke truncate on table "public"."ProjectRepositoryMapping" from "anon";

revoke update on table "public"."ProjectRepositoryMapping" from "anon";

revoke delete on table "public"."ProjectRepositoryMapping" from "authenticated";

revoke insert on table "public"."ProjectRepositoryMapping" from "authenticated";

revoke references on table "public"."ProjectRepositoryMapping" from "authenticated";

revoke select on table "public"."ProjectRepositoryMapping" from "authenticated";

revoke trigger on table "public"."ProjectRepositoryMapping" from "authenticated";

revoke truncate on table "public"."ProjectRepositoryMapping" from "authenticated";

revoke update on table "public"."ProjectRepositoryMapping" from "authenticated";

revoke delete on table "public"."ProjectRepositoryMapping" from "service_role";

revoke insert on table "public"."ProjectRepositoryMapping" from "service_role";

revoke references on table "public"."ProjectRepositoryMapping" from "service_role";

revoke select on table "public"."ProjectRepositoryMapping" from "service_role";

revoke trigger on table "public"."ProjectRepositoryMapping" from "service_role";

revoke truncate on table "public"."ProjectRepositoryMapping" from "service_role";

revoke update on table "public"."ProjectRepositoryMapping" from "service_role";

alter table "public"."Migration" drop constraint "Migration_projectId_fkey";

alter table "public"."Migration" drop column "projectId";


