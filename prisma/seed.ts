import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 30; i++) {
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
        state: faker.location.state({ abbreviated: true }) ,
        region: faker.helpers.arrayElement(['ALL', 'WEST', 'MIDWEST', 'SOUTH', 'EAST']),
        createdAt: faker.date.past(),
      }
    });

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
          dateCreated: faker.date.recent(60)
        }
      });

      const numberOfLikes = faker.number.int({ min: 0, max: 30 });
      for (let k = 0; k < numberOfLikes; k++) {
        const randomUserId = faker.helpers.arrayElement(
          (await prisma.user.findMany()).map((user) => user.id)
        );

        // Check if the vote already exists
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
        }
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
