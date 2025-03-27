INSERT INTO "Project"
  (name, "updatedAt")
VALUES
  ('liam', now());

INSERT INTO "Repository"
  (name, owner, "installationId", "updatedAt")
VALUES
  ('liam', 'liam-hq', 62899121, now());

INSERT INTO "ProjectRepositoryMapping"
  ("projectId", "repositoryId", "updatedAt")
VALUES
  (1, 1, now());

INSERT INTO "WatchSchemaFilePattern"
  (pattern, "projectId", "updatedAt")
VALUES
  ('frontend/packages/db/prisma/**', 1, now());