import { NextApiRequest, NextApiResponse } from 'next/types';
import { getServerAuthSession } from 'src/server/auth';
import { prisma } from 'src/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!req.body.username || !req.body.threadId) {
    return res.status(200).json([]);
  }

  const threadId = req.body.threadId;

  const response = await prisma.user.findMany({
    where: {
      username: {
        startsWith: req.body.username,
        mode: 'insensitive'
      },
      profileIsComplete: true,
      isWhitelisted: true,
      id: {
        not: session.user.id
      },
      OR: [
        {
          followers: {
            some: {
              followedId: session.user.id
            }
          }
        },
        {
          threadComments: {
            some: {
              threadId: threadId
            }
          }
        }
      ]
    },
    select: {
      id: true,
      username: true
    },
    take: 8
  });

  console.log({ response });

  if (!response) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json(response);
}
