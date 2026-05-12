import { Contacts, UserLoggedIn } from "@/components";
import { authGuard, getCurrentUser, getUsers } from "@/server-fns";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => authGuard(),
  component: Home,
  validateSearch: (search: Record<string, unknown>) => ({
    user: (search.user as string) || undefined,
  }),
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
