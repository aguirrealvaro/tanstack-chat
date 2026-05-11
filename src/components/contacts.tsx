import { Route as HomeRoute } from "@/routes/index";

export const Contacts = () => {
  const { users } = HomeRoute.useLoaderData();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.firstName}</div>
      ))}
    </div>
  );
};
