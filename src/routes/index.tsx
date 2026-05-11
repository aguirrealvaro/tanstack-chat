import { Contacts, UserLoggedIn } from "@/components";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/db";

const authGuard = createServerFn().handler(async () => {
  const { userId } = await auth();

  if (!userId) {
    throw redirect({ to: "/sign-in" });
  }

  return { userId };
});

const getCurrentUser = createServerFn().handler(async () => {
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

const getUsers = createServerFn().handler(async () => {
  const currentUser = await getCurrentUser();

  const users = await prisma.user.findMany({
    include: {
      messagesReceived: {
        where: { fromId: currentUser.id },
        orderBy: {
          createdAt: "asc",
        },
      },
      messagesSent: {
        where: { toId: currentUser.id },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    where: {
      id: {
        not: { equals: currentUser.id },
      },
    },
  });

  return users;
});

export const Route = createFileRoute("/")({
  beforeLoad: () => authGuard(),
  component: Home,
  loader: async () => {
    const [currentUser, users] = await Promise.all([getCurrentUser(), getUsers()]);
    return { currentUser, users };
  },
});

function Home() {
  return (
    <div className="m-4 flex h-full rounded border bg-card text-card-foreground shadow">
      <div className="flex flex-1 flex-col border-r p-4">
        <UserLoggedIn />
        <Contacts />
      </div>
      <div className="flex flex-2 flex-col p-4">messages</div>
    </div>
  );
}
