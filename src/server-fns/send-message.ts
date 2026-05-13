import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth-middleware";

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      message: z.string(),
      selectedUser: z.number(),
    }),
  )
  .handler(async ({ data: { message, selectedUser }, context: { currentUser } }) => {
    // Dev only: send exactly "/sim-error" to test optimistic rollback (onError).
    if (import.meta.env.DEV && message.trim() === "/force-error") {
      throw new Error("Simulated send failure");
    }

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
