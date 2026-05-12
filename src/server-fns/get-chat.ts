import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth-middleware";

export const getChat = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.number())
  .handler(async ({ data: userSelected, context: { currentUser } }) => {
    await prisma.message.updateMany({
      where: { fromId: Number(userSelected), toId: currentUser.id },
      data: { seen: true },
    });

    const chat = await prisma.message.findMany({
      where: {
        OR: [
          { fromId: currentUser.id, toId: userSelected },
          { fromId: userSelected, toId: currentUser.id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return chat;
  });
