import { UserButton } from "@clerk/tanstack-react-start";
import { Route as HomeRoute } from "@/routes/index";
import { ThemeToggle } from "../theme-toggle";

export const UserLoggedIn = () => {
  const { loggedInUser } = HomeRoute.useRouteContext();

  return (
    <div className="mb-4 flex items-center justify-between gap-4 border-b px-4 pb-4">
      <div className="flex flex-col">
        <span>Hello, {loggedInUser.firstName}</span>
        <span className="pointer-events-none truncate text-sm text-muted-foreground">
          {loggedInUser.email}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
};
