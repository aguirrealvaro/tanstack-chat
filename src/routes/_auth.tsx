import { auth } from "@clerk/tanstack-react-start/server";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getAuthState = createServerFn().handler(async () => {
  const { userId } = await auth();
  return { userId };
});

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const { userId } = await getAuthState();
    if (userId) {
      throw redirect({ to: "/", search: { user: undefined } });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Outlet />
    </div>
  );
}
