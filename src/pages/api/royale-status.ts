import { RapRoyaleStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { prisma } from 'src/server/db';

export const revalidate = 0;

export default async function updateRapRoyaleStatuses(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    // Current date for comparison
    const now = new Date();

    // Update the status of all rap royales that should be open
    await prisma.rapRoyale.updateMany({
      where: {
        startDate: {
          lte: now // Start date is in the past or now
        },
        endDate: {
          gt: now // End date is in the future
        },
        status: {
          not: RapRoyaleStatus.OPEN // Ensure we're not updating already open royales
        }
      },
      data: {
        status: RapRoyaleStatus.OPEN
      }
    });

    // Update the status of all rap royales that should be closed
    await prisma.rapRoyale.updateMany({
      where: {
        endDate: {
          lt: now // End date is in the past
        },
        status: {
          not: RapRoyaleStatus.ENDED // Ensure we're not updating already ended royales
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
