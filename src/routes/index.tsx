import { Contacts, UserLoggedIn, ChatPanel, Footer } from "@/components";
import { getCurrentUser } from "@/server-fns";
import { usersQueryOptions, chatQueryOptions } from "@/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const currentUser = await getCurrentUser();
    return { currentUser };
  },
  component: Home,
  validateSearch: (search: Record<string, unknown>) => ({
    user: Number(search.user) || undefined,
  }),
  loaderDeps: ({ search: { user: selectedUser } }) => ({ selectedUser }),
  loader: ({ deps: { selectedUser }, context: { queryClient } }) => {
    // `prefetchQuery` instead of `ensureQueryData` to avoid blocking the main thread and use suspense instead
    queryClient.prefetchQuery(usersQueryOptions());
    queryClient.prefetchQuery(chatQueryOptions(selectedUser));
  },
});

function Home() {
  return (
    <>
      <main className="m-4 flex h-full rounded border bg-card text-card-foreground shadow">
        <div className="flex flex-1 flex-col border-r p-4">
          <UserLoggedIn />
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                {Array.from(Array(2).keys()).map((key) => (
                  <Skeleton className="h-12" key={key} />
                ))}
              </div>
            }
          >
            <Contacts />
          </Suspense>
        </div>
        <div className="flex flex-2 flex-col p-4">
          <Suspense
            fallback={
              <div className="flex flex-1 flex-col gap-4">
                {Array.from(Array(10).keys()).map((key) => {
                  const isOdd = key % 2 === 0;
                  return (
                    <Skeleton
                      className={cn("h-8 w-44", isOdd ? "self-start" : "self-end")}
                      key={key}
                    />
                  );
                })}
              </div>
            }
          >
            <ChatPanel />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
