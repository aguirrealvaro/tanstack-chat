import { UserLoggedIn } from "@/components";
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

export const Route = createFileRoute("/")({
  beforeLoad: () => authGuard(),
  component: Home,
  loader: () => getCurrentUser(),
});

function Home() {
  return (
    <div className="m-4 flex h-full rounded border bg-card text-card-foreground shadow">
      <div className="flex flex-1 flex-col border-r p-4">
        <UserLoggedIn />
      </div>
      <div className="flex flex-2 flex-col p-4">messages</div>
    </div>
  );
}
