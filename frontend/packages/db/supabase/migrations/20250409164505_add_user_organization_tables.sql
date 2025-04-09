-- Add new columns to existing tables
ALTER TABLE "public"."Project" 
  ADD COLUMN IF NOT EXISTS "organizationId" integer;

-- Create new tables
CREATE TABLE IF NOT EXISTS "public"."User" (
  "id" uuid PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."Organization" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."OrganizationMember" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "userId" uuid NOT NULL REFERENCES "public"."User"("id") ON DELETE CASCADE,
  "organizationId" integer NOT NULL REFERENCES "public"."Organization"("id") ON DELETE CASCADE,
  "status" text NOT NULL,
  "joinedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "organizationId")
);

CREATE TABLE IF NOT EXISTS "public"."ProjectMember" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "userId" uuid NOT NULL REFERENCES "public"."User"("id") ON DELETE CASCADE,
  "projectId" integer NOT NULL REFERENCES "public"."Project"("id") ON DELETE CASCADE,
  "organizationMemberId" integer REFERENCES "public"."OrganizationMember"("id") ON DELETE CASCADE,
  "status" text NOT NULL,
  "joinedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "projectId")
);

CREATE TABLE IF NOT EXISTS "public"."MembershipInvites" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" text NOT NULL,
  "inviteByUserId" uuid NOT NULL REFERENCES "public"."User"("id") ON DELETE CASCADE,
  "organizationId" integer NOT NULL REFERENCES "public"."Organization"("id") ON DELETE CASCADE,
  "inviteOn" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "organization_member_userId_idx" ON "public"."OrganizationMember" ("userId");
CREATE INDEX IF NOT EXISTS "organization_member_organizationId_idx" ON "public"."OrganizationMember" ("organizationId");
CREATE INDEX IF NOT EXISTS "project_member_userId_idx" ON "public"."ProjectMember" ("userId");
CREATE INDEX IF NOT EXISTS "project_member_projectId_idx" ON "public"."ProjectMember" ("projectId");
CREATE INDEX IF NOT EXISTS "project_member_org_memberId_idx" ON "public"."ProjectMember" ("organizationMemberId");
CREATE INDEX IF NOT EXISTS "membership_invites_email_idx" ON "public"."MembershipInvites" ("email");
CREATE INDEX IF NOT EXISTS "membership_invites_orgId_idx" ON "public"."MembershipInvites" ("organizationId");

-- Set up Row Level Security (RLS) policies
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."OrganizationMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ProjectMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MembershipInvites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Project" ENABLE ROW LEVEL SECURITY;


-- Grant permissions
GRANT ALL ON TABLE "public"."User" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."Organization" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."OrganizationMember" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."ProjectMember" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."MembershipInvites" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."Project" TO "anon", "authenticated", "service_role";