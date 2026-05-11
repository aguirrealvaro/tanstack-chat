import { ThemeToggle } from "@/components";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { UserButton } from "@clerk/tanstack-react-start";

const authGuard = createServerFn().handler(async () => {
  const { userId } = await auth();

  if (!userId) {
    throw redirect({ to: "/sign-in" });
  }

  return { userId };
});

export const Route = createFileRoute("/")({
  beforeLoad: () => authGuard(),
  component: Home,
});

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started
      </p>
      <UserButton />
      <ThemeToggle />
    </div>
  );
}
