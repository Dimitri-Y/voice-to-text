ALTER TABLE "User"
  ADD COLUMN "uuid" uuid NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE "Recording"
  ADD COLUMN "uuid" uuid NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE "Recording"
  ADD COLUMN "userUuid" uuid;

UPDATE "Recording" r
SET "userUuid" = u.uuid
FROM "User" u
WHERE r."userId" = u.id;

ALTER TABLE "Recording" DROP CONSTRAINT "Recording_userId_fkey";

ALTER TABLE "Recording"
  ALTER COLUMN "userUuid" SET NOT NULL,
  ADD CONSTRAINT "Recording_userUuid_fkey"
    FOREIGN KEY ("userUuid") REFERENCES "User" ("uuid");

ALTER TABLE "Recording" DROP COLUMN "userId";
ALTER TABLE "User"     DROP COLUMN "id";

ALTER TABLE "Recording" RENAME COLUMN "uuid"     TO "id";
ALTER TABLE "Recording" RENAME COLUMN "userUuid" TO "userId";
ALTER TABLE "User"      RENAME COLUMN "uuid"     TO "id";