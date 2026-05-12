import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getUser = createServerFn()
  .inputValidator(z.number())
  .handler(async ({ data: id }) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  });
