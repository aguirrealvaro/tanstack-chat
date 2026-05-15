import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
import { authMiddleware } from "./auth-middleware";
// import { sleep } from "@/lib/sleep";

export const getUsers = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { loggedInUser } }) => {
    // await sleep(10000);
    const users = await prisma.user.findMany({
      include: {
        messagesReceived: {
          where: { fromId: loggedInUser.id },
          orderBy: {
            createdAt: "asc",
          },
        },
        messagesSent: {
          where: { toId: loggedInUser.id },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      where: {
        id: {
          not: { equals: loggedInUser.id },
        },
      },
    });

    return users;
  });
