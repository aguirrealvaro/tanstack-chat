import { usersQueryOptions } from "@/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Route as HomeRoute } from "@/routes/index";
import { UserSelected } from "./user-selected";
import { Messages } from "./messages";
import { InputMessage } from "./input-message";
import { cn } from "@/lib/utils";

const styles = cn("flex flex-1 items-center justify-center");

export const ChatPanel = () => {
  const { data: users } = useSuspenseQuery(usersQueryOptions());
  const { user: selectedUser } = HomeRoute.useSearch();

  if (!selectedUser) {
    return <span className={styles}>Select user to start a conversation</span>;
  }

  const selectedUserData = users.find((user) => user.id === selectedUser);

  if (!selectedUserData) {
    return <span className={styles}>Invalid user</span>;
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
