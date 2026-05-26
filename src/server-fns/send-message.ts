import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth-middleware";

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(
    z
      .object({
        message: z.string(),
        imageUrl: z.string().min(1).optional(),
        selectedUser: z.number(),
      })
      .refine((data) => data.message.trim().length > 0 || !!data.imageUrl, {
        message: "Message text or image is required",
      }),
  )
  .handler(
    async ({ data: { message, imageUrl, selectedUser }, context: { loggedInUser } }) => {
      // Dev only: send exactly "/sim-error" to test optimistic rollback (onError).
      if (import.meta.env.DEV && message.trim() === "/force-error") {
        throw new Error("Simulated send failure");
      }

      const newMessage = await prisma.message.create({
        data: {
          text: message,
          imageUrl: imageUrl ?? null,
          fromId: loggedInUser.id,
          toId: selectedUser,
        },
      });

      return {
        status: `Message: '${message}' sent`,
        newMessage,
      };
    },
  );
