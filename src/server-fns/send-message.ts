import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth-middleware";

export const sendMessage = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      message: z.string(),
      selectedUser: z.number(),
    }),
  )
  .handler(async ({ data: { message, selectedUser }, context: { currentUser } }) => {
    await prisma.message.create({
      data: {
        text: message,
        fromId: currentUser.id,
        toId: selectedUser,
      },
    });

    return {
      status: `Message: '${message}' sent`,
    };
  });
