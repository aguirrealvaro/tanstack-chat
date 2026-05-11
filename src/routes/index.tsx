import { HeaderUser, ThemeToggle } from "@/components";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <SignedIn>
        <div className="p-8">
          <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
          <p className="mt-4 text-lg">
            Edit <code>src/routes/index.tsx</code> to get started
          </p>
          <HeaderUser />
          <ThemeToggle />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
