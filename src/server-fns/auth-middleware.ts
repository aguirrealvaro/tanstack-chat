import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/db";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { userId } = await auth();

  if (!userId) {
    throw redirect({ to: "/sign-in" });
  }

  const loggedInUser = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!loggedInUser) {
    throw new Error("No logged-in user");
  }

  return next({ context: { loggedInUser } });
});
