import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

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

async function seedDatabase() {
  // For user...
  for (let i = 0; i < 100; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email(name);
    const username = name.toLowerCase().replace(/ /g, '.');
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        username: username,
        image: faker.image.avatar(),
        bannerUrl: faker.image.imageUrl(),
        bio: faker.lorem.sentence(),
        sex: faker.helpers.arrayElement(['male', 'female']),
        dob: faker.date.past(30, new Date('2003-01-01')),
        country: 'United States',
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        region: faker.helpers.arrayElement(['ALL', 'WEST', 'MIDWEST', 'SOUTH', 'EAST']),
        createdAt: faker.date.past(),
      }
    });

    // For rap...
    for (let j = 0; j < 3; j++) {
      const rap = await prisma.rap.create({
        data: {
          title: faker.lorem.words(3),
          content: faker.lorem.paragraphs(3),
          user: {
            connect: {
              id: user.id
            }
          },
          status: 'PUBLISHED',
          dateCreated: faker.date.past()
        }
      });

      // For like...
      const numberOfLikes = faker.number.int({ min: 0, max: 2 });
      for (let k = 0; k < numberOfLikes; k++) {
        const randomUserId = faker.helpers.arrayElement(
          (await prisma.user.findMany()).map((user) => user.id)
        );

        const existingVote = await prisma.rapVote.findUnique({
          where: {
            userId_rapId: {
              userId: randomUserId,
              rapId: rap.id
            }
          }
        });

        if (!existingVote) {
          await prisma.rapVote.create({
            data: {
              type: 'LIKE',
              user: {
                connect: {
                  id: randomUserId
                }
              },
              rap: {
                connect: {
                  id: rap.id
                }
              }
            }
          });
          await prisma.rap.update({
            where: {
              id: rap.id
            },
            data: {
              likesCount: {
                increment: 1
              }
            }
          });
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              points: {
                increment: 1
              }
            }
          });
        }
      }
    }
  }
}

async function main() {
  await clearDatabase();
  await seedDatabase();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
