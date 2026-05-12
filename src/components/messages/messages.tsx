import { Route as HomeRoute } from "@/routes/index";

export const Messages = () => {
  const { user: selectedUserId } = HomeRoute.useSearch();
  const { chat } = HomeRoute.useLoaderData();

  if (!selectedUserId)
    return (
      <span className="flex flex-1 items-center justify-center">
        Select user to start a conversation
      </span>
    );

  return <div>{JSON.stringify(chat)}</div>;
};
