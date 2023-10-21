import { Notification } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
} from "src/server/api/trpc";

export type NotificationWithAssociatedData = Notification & {
  comment: {
    id: string;
    content: string;
  } | null;
  rap: {
    title: string;
    id: string;
  } | null;
  notifierUser: {
    id: string;
    username: string;
    profileImageUrl: string;
  } | null;
}

export const notificationsRouter = createTRPCRouter({
  getUserNotifications: protectedProcedure
    .query(async ({ ctx }) => {
      const notifications = await ctx.prisma.notification.findMany({
        where: {
          recipientId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          comment: {
            select: {
              id: true,
              content: true,
            }
          },
          rap: {
            select: {
              title: true,
              id: true,
            }
          },
          notifierUser: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
            }
          },
        }
      });

      return notifications as NotificationWithAssociatedData[];
    }),
});
