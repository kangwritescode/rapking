import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.commentVote.deleteMany({});
  await prisma.rapComment.deleteMany({});
  await prisma.rapVote.deleteMany({});
  await prisma.rap.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.userFollows.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
}

async function seedDatabase() {}

async function main() {
  await clearDatabase();
  await seedDatabase();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
