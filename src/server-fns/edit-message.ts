import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth-middleware";
import { z } from "zod";
import { prisma } from "@/db";

export const editMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ messageId: z.number(), newMessageValue: z.string() }))
  .handler(async ({ data: { messageId, newMessageValue }, context: { loggedInUser } }) => {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) {
      throw new Error("Message not found");
    }

    const isOwner = message.fromId === loggedInUser.id;

    if (!isOwner) {
      throw new Error("This is not your message");
    }

    const editedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { text: newMessageValue },
    });

    return { message: "Message edited", editedMessage };
  });
