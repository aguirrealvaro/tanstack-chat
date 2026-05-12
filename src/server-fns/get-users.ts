import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
import { authMiddleware } from "./auth-middleware";
// import { sleep } from "@/lib/sleep";

export const getUsers = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { currentUser } }) => {
    // await sleep(5000);
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
