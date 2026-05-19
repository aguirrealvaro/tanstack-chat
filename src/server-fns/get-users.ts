import { createServerFn } from "@tanstack/react-start";
import { getLastMessage } from "@/components/contacts/utils";
import type { UserType } from "@/components/contacts/types";
import { prisma } from "@/db";
import { authMiddleware } from "./auth-middleware";
// import { sleep } from "@/lib/sleep";

const sortUsersByLastMessage = (users: UserType[]) => {
  return users.sort((a, b) => {
    const timeA = getLastMessage(a)?.createdAt.getTime() ?? 0;
    const timeB = getLastMessage(b)?.createdAt.getTime() ?? 0;
    return timeB - timeA;
  });
};

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

    return sortUsersByLastMessage(users);
  });
