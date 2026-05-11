import { UserButton } from "@clerk/tanstack-react-start";
import { ThemeToggle } from "./theme-toggle";
import { Route as HomeRoute } from "@/routes/index";

export const UserLoggedIn = () => {
  const { currentUser } = HomeRoute.useLoaderData();

  return (
    <div className="mb-4 flex items-center justify-between gap-4 border-b px-4 pb-4">
      <div className="flex flex-col">
        <span>Hello, {currentUser.firstName}</span>
        <span className="pointer-events-none truncate text-sm">{currentUser.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
};
