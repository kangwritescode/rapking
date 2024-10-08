import { faker } from '@faker-js/faker';
import { PrismaClient, SocialPlatform, User } from '@prisma/client';
import { env } from 'process';

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.threadCommentVote.deleteMany({});
  await prisma.threadComment.deleteMany({});
  await prisma.rapVote.deleteMany({});
  await prisma.rap.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.userFollows.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.notification.deleteMany({});
}

async function seedDatabase() {
  if (env.NODE_ENV === 'production') {
    return;
  }

  await prisma.user.create({
    data: {
      email: 'joeshmoe@email.com',
      name: 'Joe Shmoe',
      username: 'joeshmoe',
      isAdmin: true,
      profileIsComplete: true,
      sex: 'male',
      country: 'US',
      createdAt: new Date(),
      dob: new Date()
    }
  });

  const genders = ['male', 'female'];

  // Generate 30 users
  const users: User[] = [];
  for (let i = 0; i < 30; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        profileImageUrl: null,
        username: faker.internet.userName(),
        sex: faker.helpers.arrayElement(genders),
        dob: faker.date.past(),
        country: 'US',
        profileIsComplete: true // Set to true for simplicity,
      }
    });
    users.push(user);
  }

  // Generate data for each user
  for (const user of users) {
    // Generate a wall for each user
    const wallThread = await prisma.thread.create({
      data: {
        type: 'WALL',
        ownerId: user.id
      }
    });

    await prisma.wall.create({
      data: {
        threadId: wallThread.id,
        ownerId: user.id
      }
    });

    // Generate one rap for each user
    const rap = await prisma.rap.create({
      data: {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(2),
        userId: user.id,
        status: 'PUBLISHED'
      }
    });

    const thread = await prisma.thread.create({
      data: {
        ownerId: user.id,
        type: 'RAP',
        rapId: rap.id
      }
    });

    // Generate a RapThread for each rap's thread
    await prisma.rapThread.create({
      data: {
        rapId: rap.id,
        threadId: thread.id,
        ownerId: user.id
      }
    });

    // Generate 5 comments for each rap
    for (let i = 0; i < 5; i++) {
      const comment = await prisma.threadComment.create({
        data: {
          content: faker.lorem.sentence(),
          userId: faker.helpers.arrayElement(users).id,
          threadId: thread.id
        }
      });

      // Generate votes for each comment
      await prisma.threadCommentVote.create({
        data: {
          type: 'LIKE',
          userId: faker.helpers.arrayElement(users).id,
          threadCommentId: comment.id
        }
      });
    }

    // Generate one social link for each user
    await prisma.socialLink.create({
      data: {
        userId: user.id,
        platform: faker.helpers.arrayElement(Object.values(SocialPlatform)),
        link: faker.internet.url(),
        displayText: faker.random.word()
      }
    });

    // Generate one article for each user
    await prisma.article.create({
      data: {
        title: faker.lorem.words(5),
        subtitle: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        bannerImage: faker.image.imageUrl(),
        authorId: user.id,
        slug: faker.helpers.slugify(faker.lorem.words(5))
      }
    });

    // Generate votes for each rap
    await prisma.rapVote.create({
      data: {
        type: 'LIKE',
        userId: faker.helpers.arrayElement(users).id,
        rapId: rap.id
      }
    });
  }
}

async function main() {
  if (env.NODE_ENV === 'production') {
    return;
  }
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
