import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth-middleware";
import { z } from "zod";
import { prisma } from "@/db";

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ messageId: z.number() }))
  .handler(async ({ data: { messageId }, context: { loggedInUser } }) => {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) {
      throw new Error("Message not found");
    }

    const isOwner = message.fromId === loggedInUser.id;

    if (!isOwner) {
      throw new Error("This is not your message");
    }

    const deletedMessage = await prisma.message.delete({ where: { id: messageId } });

    return { message: "Message deleted", deletedMessage };
  });
