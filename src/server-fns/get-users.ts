import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
import { authMiddleware } from "./auth-middleware";

export const getUsers = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { currentUser } }) => {
    const users = await prisma.user.findMany({
      include: {
        messagesReceived: {
          where: { fromId: currentUser.id },
          orderBy: {
            createdAt: "asc",
          },
        },
        messagesSent: {
          where: { toId: currentUser.id },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      where: {
        id: {
          not: { equals: currentUser.id },
        },
      },
    });

    return users;
  });
