import { Route as HomeRoute } from "@/routes/index";
import { UserButton } from "./user-button";

export const Contacts = () => {
  const { users } = HomeRoute.useLoaderData();

  if (users.length === 0) {
    return <span>There are no registered users</span>;
  }

  return (
    <ul>
      {users.map((user) => {
        return (
          <li key={user.id}>
            <UserButton user={user} />
          </li>
        );
      })}
    </ul>
  );
};
