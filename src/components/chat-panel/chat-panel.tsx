import { usersQueryOptions } from "@/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Route as HomeRoute } from "@/routes/index";
import { UserSelected } from "./user-selected";
import { Messages } from "./messages";
import { InputMessage } from "./input-message";

export const ChatPanel = () => {
  const { user: selectedUser } = HomeRoute.useSearch();
  const { data: users } = useSuspenseQuery(usersQueryOptions());

  const selectedUserData = users.find((user) => user.id === selectedUser);

  if (!selectedUserData) {
    return (
      <span className="flex flex-1 items-center justify-center">
        {selectedUser ? "Invalid user" : "Select user to start a conversation"}
      </span>
    );
  }

  return (
    <>
      <UserSelected selectedUserData={selectedUserData} />
      <div className="flex flex-1 flex-col gap-4">
        <Messages />
        <InputMessage />
      </div>
    </>
  );
};
