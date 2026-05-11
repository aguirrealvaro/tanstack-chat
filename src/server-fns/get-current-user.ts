import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/db";

export const getCurrentUser = createServerFn().handler(async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!currentUser) {
    throw new Error("No current user");
  }

  return currentUser;
});
