import {
  Contacts,
  Messages,
  UserLoggedIn,
  UserSelected,
  InputMessage,
  Footer,
} from "@/components";
import { authGuard, getChat, getCurrentUser, getUsers } from "@/server-fns";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    await authGuard();
    const currentUser = await getCurrentUser();
    return { currentUser };
  },
  component: Home,
  validateSearch: (search: Record<string, unknown>) => ({
    user: Number(search.user) || undefined,
  }),
  loaderDeps: ({ search: { user } }) => ({ user }),
  loader: async ({ deps: { user } }) => {
    const [users, chat] = await Promise.all([
      getUsers(),
      user ? getChat({ data: user }) : null,
    ]);
    return { users, chat };
  },
});

function Home() {
  return (
    <>
      <main className="m-4 flex h-full rounded border bg-card text-card-foreground shadow">
        <div className="flex flex-1 flex-col border-r p-4">
          <UserLoggedIn />
          <Contacts />
        </div>
        <div className="flex flex-2 flex-col p-4">
          <UserSelected />
          <div className="flex flex-1 flex-col gap-4">
            <Messages />
            <InputMessage />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
