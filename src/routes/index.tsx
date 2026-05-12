import { Contacts, UserLoggedIn, ChatPanel, Footer } from "@/components";
import { getCurrentUser } from "@/server-fns";
import { usersQueryOptions, chatQueryOptions } from "@/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

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
              <div className="flex flex-1 items-center justify-center">
                Loading contacts...
              </div>
            }
          >
            <Contacts />
          </Suspense>
        </div>
        <div className="flex flex-2 flex-col p-4">
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center">
                Loading messages...
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
