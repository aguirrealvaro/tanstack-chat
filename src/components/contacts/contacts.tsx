import { usersQueryOptions } from "@/queries/users";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UserButton } from "./user-button";

export const Contacts = () => {
  const { data: users } = useSuspenseQuery(usersQueryOptions());

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
