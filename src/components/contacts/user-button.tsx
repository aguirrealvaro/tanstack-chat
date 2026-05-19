import { cn } from "@/lib/utils";
import { Route as HomeRoute } from "@/routes/index";
import { getLastMessage, getMessageTime } from "./utils";
import type { UserType } from "./types";
import { DoubleCheck } from "../double-check";

export const UserButton = ({ user }: { user: UserType }) => {
  const { loggedInUser } = HomeRoute.useRouteContext();

  const lastMessage = getLastMessage(user);
  const isLastMessageFromLoggedInUser = lastMessage?.fromId === loggedInUser.id;
  const isLastMessageUnseen =
    !isLastMessageFromLoggedInUser && (lastMessage ? !lastMessage.seen : false);

  const unseenMessages = user.messagesSent.filter((message) => !message.seen).length;
  const showUnseenMessages = !isLastMessageFromLoggedInUser && unseenMessages > 0;

  const navigate = HomeRoute.useNavigate();
  const handleSelectUser = () => {
    navigate({ search: { user: user.id } });
  };

  const { user: selectedUser } = HomeRoute.useSearch();
  const isSelectedUser = selectedUser === user.id;

  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-4",
        "rounded px-4 py-2",
        "hover:bg-muted",
        isSelectedUser && "bg-muted",
      )}
      onClick={handleSelectUser}
    >
      <img
        src={user.imageUrl}
        width={35}
        height={35}
        alt={`${user.firstName}'s-profile-image`}
        className="rounded-full"
      />
      <div className="flex w-full items-center justify-between gap-4">
        <div
          className={cn("flex min-w-0 flex-col items-start", {
            "font-bold": isLastMessageUnseen,
          })}
        >
          <span>{user.firstName}</span>
          {lastMessage && (
            <div className="flex items-center gap-2">
              {isLastMessageFromLoggedInUser && <DoubleCheck seen={lastMessage.seen} />}
              <span className="line-clamp-2 min-w-0 text-left text-sm text-muted-foreground">
                {lastMessage.text}
              </span>
            </div>
          )}
        </div>
        {lastMessage && (
          <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
            <span>{getMessageTime(lastMessage.createdAt)}</span>
            {showUnseenMessages && (
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-xs",
                  "bg-foreground text-background",
                )}
              >
                {unseenMessages}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};
