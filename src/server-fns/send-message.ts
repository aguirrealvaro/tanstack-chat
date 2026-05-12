import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser } from "./get-current-user";
import { z } from "zod";

export const sendMessage = createServerFn()
  .inputValidator(
    z.object({
      message: z.string(),
      userSelected: z.number(),
    }),
  )
  .handler(async ({ data: { message, userSelected } }) => {
    const currentUser = await getCurrentUser();

    await prisma.message.create({
      data: {
        text: message,
        fromId: currentUser.id,
        toId: Number(userSelected),
      },
    });

    return {
      status: `Message: '${message}' sent`,
    };
  });
