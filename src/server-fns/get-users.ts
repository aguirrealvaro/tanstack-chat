import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
import { getCurrentUser } from "./get-current-user";

export const getUsers = createServerFn().handler(async () => {
  const currentUser = await getCurrentUser();

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
