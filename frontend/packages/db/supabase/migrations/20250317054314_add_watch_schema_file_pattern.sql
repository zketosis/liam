create sequence "public"."WatchSchemaFilePattern_id_seq";

create table "public"."WatchSchemaFilePattern" (
    "id" integer not null default nextval('"WatchSchemaFilePattern_id_seq"'::regclass),
    "pattern" text not null,
    "projectId" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


alter sequence "public"."WatchSchemaFilePattern_id_seq" owned by "public"."WatchSchemaFilePattern"."id";

CREATE UNIQUE INDEX "WatchSchemaFilePattern_pkey" ON public."WatchSchemaFilePattern" USING btree (id);

alter table "public"."WatchSchemaFilePattern" add constraint "WatchSchemaFilePattern_pkey" PRIMARY KEY using index "WatchSchemaFilePattern_pkey";

alter table "public"."WatchSchemaFilePattern" add constraint "WatchSchemaFilePattern_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."WatchSchemaFilePattern" validate constraint "WatchSchemaFilePattern_projectId_fkey";


