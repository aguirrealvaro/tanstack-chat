import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/db";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { userId } = await auth();

  if (!userId) {
    throw redirect({ to: "/sign-in" });
  }

  let loggedInUser = await prisma.user.findUnique({ where: { clerkId: userId } });

  // Clerk may already have a session while our DB row is still missing: the user.created
  // webhook runs asynchronously, and OAuth (e.g. Google) redirects to the app before it lands.
  if (!loggedInUser) {
    const clerkUser = await clerkClient().users.getUser(userId);
    const email =
      clerkUser.emailAddresses.find(
        (address) => address.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? "";

    const fields = {
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      email,
      imageUrl: clerkUser.imageUrl,
    };

    loggedInUser = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      create: { clerkId: clerkUser.id, ...fields },
      update: fields,
    });
  }

  return next({ context: { loggedInUser } });
});
