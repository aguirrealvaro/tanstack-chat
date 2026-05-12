import { Contacts, Messages, UserLoggedIn, UserSelected } from "@/components";
import { authGuard, getChat, getCurrentUser, getUsers } from "@/server-fns";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => authGuard(),
  component: Home,
  validateSearch: (search: Record<string, unknown>) => ({
    user: Number(search.user) || undefined,
  }),
  loaderDeps: ({ search: { user } }) => ({ user }),
  loader: async ({ deps: { user } }) => {
    const [currentUser, users, chat] = await Promise.all([
      getCurrentUser(),
      getUsers(),
      user ? getChat({ data: user }) : null,
    ]);
    return { currentUser, users, chat };
  },
});

function Home() {
  return (
    <div className="m-4 flex h-full rounded border bg-card text-card-foreground shadow">
      <div className="flex flex-1 flex-col border-r p-4">
        <UserLoggedIn />
        <Contacts />
      </div>
      <div className="flex flex-2 flex-col p-4">
        <UserSelected />
        <Messages />
      </div>
    </div>
  );
}
