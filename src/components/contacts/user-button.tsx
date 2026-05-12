import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Route as HomeRoute } from "@/routes/index";
import { getLastMessage } from "./utils";
import type { UserType } from "./types";

const getMessageTime = (date: Date) => {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const UserButton = ({ user }: { user: UserType }) => {
  const { currentUser } = HomeRoute.useLoaderData();

  const lastMessage = getLastMessage(user);

  const isLastMessageFromCurrentUser = lastMessage?.fromId === currentUser.id;

  const isLastMessageUnseen = !isLastMessageFromCurrentUser && !lastMessage?.seen;

  const unseenMessages = user.messagesSent.filter((message) => !message.seen).length;
  const showUnseenMessages = !isLastMessageFromCurrentUser && unseenMessages > 0;

  const navigate = HomeRoute.useNavigate();

  const handleSelectUser = () => {
    navigate({ search: { user: String(user.id) } });
  };

  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-4",
        "rounded px-4 py-2",
        "hover:bg-hover",
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
        <div className={cn("flex flex-col items-start", { "font-bold": isLastMessageUnseen })}>
          <span>{user.firstName}</span>
          {lastMessage && (
            <div className="flex items-center gap-2">
              {isLastMessageFromCurrentUser && (
                <div className="flex shrink-0 items-center">
                  <Check size={13} />
                  {lastMessage.seen && <Check size={13} className="-ml-2" />}
                </div>
              )}
              <span className="text-text-secondary text-left text-sm">{lastMessage.text}</span>
            </div>
          )}
        </div>
        {lastMessage && (
          <div className="text-text-secondary flex flex-col items-center gap-1 text-sm">
            <span>{getMessageTime(lastMessage.createdAt)}</span>
            {showUnseenMessages && (
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-xs",
                  "bg-black text-white dark:bg-white dark:text-white",
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
