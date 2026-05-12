import {
  Contacts,
  Messages,
  UserLoggedIn,
  UserSelected,
  InputMessage,
  Footer,
} from "@/components";
import { getChat, getCurrentUser } from "@/server-fns";
import { usersQueryOptions } from "@/queries/users";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

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
  loader: async ({ deps: { selectedUser }, context: { queryClient } }) => {
    const [, chat] = await Promise.all([
      queryClient.ensureQueryData(usersQueryOptions()),
      selectedUser ? getChat({ data: selectedUser }) : null,
    ]);
    return { chat };
  },
});

function Home() {
  const { user: selectedUser } = Route.useSearch();
  const { data: users } = useSuspenseQuery(usersQueryOptions());

  const selectedUserData = users.find((user) => user.id === selectedUser);

  return (
    <>
      <main className="m-4 flex h-full rounded border bg-card text-card-foreground shadow">
        <div className="flex flex-1 flex-col border-r p-4">
          <UserLoggedIn />
          <Contacts />
        </div>
        <div className="flex flex-2 flex-col p-4">
          {selectedUserData ? (
            <>
              <UserSelected selectedUserData={selectedUserData} />
              <div className="flex flex-1 flex-col gap-4">
                <Messages />
                <InputMessage />
              </div>
            </>
          ) : (
            <span className="flex flex-1 items-center justify-center">
              {selectedUser ? "Invalid user" : "Select user to start a conversation"}
            </span>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
