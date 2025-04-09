-- Add new columns to existing tables
ALTER TABLE "public"."Project" 
  ADD COLUMN IF NOT EXISTS "organization_id" integer;

-- Create new tables
CREATE TABLE IF NOT EXISTS "public"."User" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."Organization" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."OrganizationMember" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" integer NOT NULL REFERENCES "public"."User"("id") ON DELETE CASCADE,
  "organization_id" integer NOT NULL REFERENCES "public"."Organization"("id") ON DELETE CASCADE,
  "role" text NOT NULL,
  "status" text NOT NULL,
  "joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("user_id", "organization_id")
);

CREATE TABLE IF NOT EXISTS "public"."ProjectMember" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" integer NOT NULL REFERENCES "public"."User"("id") ON DELETE CASCADE,
  "project_id" integer NOT NULL REFERENCES "public"."Project"("id") ON DELETE CASCADE,
  "organization_member_id" integer REFERENCES "public"."OrganizationMember"("id") ON DELETE CASCADE,
  "role" text NOT NULL,
  "status" text NOT NULL,
  "joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("user_id", "project_id")
);

CREATE TABLE IF NOT EXISTS "public"."MembershipInvites" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" text NOT NULL,
  "invite_by_user_id" integer NOT NULL REFERENCES "public"."User"("id") ON DELETE CASCADE,
  "organization_id" integer NOT NULL REFERENCES "public"."Organization"("id") ON DELETE CASCADE,
  "role" text NOT NULL,
  "invite_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "organization_member_user_id_idx" ON "public"."OrganizationMember" ("user_id");
CREATE INDEX IF NOT EXISTS "organization_member_organization_id_idx" ON "public"."OrganizationMember" ("organization_id");
CREATE INDEX IF NOT EXISTS "project_owner_idx" ON "public"."Project" ("owner_type", "owner_id");
CREATE INDEX IF NOT EXISTS "project_member_user_id_idx" ON "public"."ProjectMember" ("user_id");
CREATE INDEX IF NOT EXISTS "project_member_project_id_idx" ON "public"."ProjectMember" ("project_id");
CREATE INDEX IF NOT EXISTS "project_member_org_member_id_idx" ON "public"."ProjectMember" ("organization_member_id");
CREATE INDEX IF NOT EXISTS "membership_invites_email_idx" ON "public"."MembershipInvites" ("email");
CREATE INDEX IF NOT EXISTS "membership_invites_org_id_idx" ON "public"."MembershipInvites" ("organization_id");

-- Set up Row Level Security (RLS) policies
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."OrganizationMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ProjectMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MembershipInvites" ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE "public"."User" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."Organization" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."OrganizationMember" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."ProjectMember" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."MembershipInvites" TO "anon", "authenticated", "service_role";