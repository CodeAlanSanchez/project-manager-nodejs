-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_senderId_fkey";

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
