import { RapRoyaleStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { prisma } from 'src/server/db';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // Update the status of all rap royales that should be open
    await prisma.rapRoyale.updateMany({
      where: {
        status: RapRoyaleStatus.NOT_STARTED,
        startDate: {
          lte: new Date()
        },
        endDate: {
          gte: new Date()
        }
      },
      data: {
        status: RapRoyaleStatus.OPEN
      }
    });

    // Update the status of all rap royales that should be closed
    await prisma.rapRoyale.updateMany({
      where: {
        status: RapRoyaleStatus.OPEN,
        endDate: {
          lt: new Date()
        }
      },
      data: {
        status: RapRoyaleStatus.ENDED
      }
    });

    return response.status(200).json({ message: 'Rap royales status updated' });
  } catch (error) {
    console.error('Failed to update rap royales status:', error);

    return response.status(500).json({ message: 'Internal server error' });
  }
}
