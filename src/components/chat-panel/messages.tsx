import type { Message } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Route as HomeRoute } from "@/routes/index";
import { chatQueryOptions } from "@/queries/chat";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getMessageTime } from "./utils";
import { Check } from "lucide-react";

const useAutoScroll = (chat: Message[]) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chat]);

  return { containerRef };
};

export const Messages = () => {
  const { user: selectedUser } = HomeRoute.useSearch();
  const { currentUser } = HomeRoute.useRouteContext();
  const { data: chat } = useSuspenseQuery(chatQueryOptions(selectedUser));

  const queryClient = useQueryClient();

  const { containerRef } = useAutoScroll(chat);

  useEffect(() => {
    // invalidate users query to refresh the unseen messages
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }, [selectedUser]);

  return (
    <div
      className="-mr-4 flex h-0 flex-col gap-2 overflow-y-auto pr-4 break-all"
      style={{ flex: "1 1 auto" }}
      ref={containerRef}
    >
      {chat.map((message) => {
        const isUserMessage = message.fromId === currentUser.id;

        return (
          <div
            key={message.id}
            className={cn(
              "flex flex-row gap-4 rounded-lg p-2 text-sm",
              isUserMessage
                ? cn("ml-4 self-end", "bg-foreground text-background")
                : cn("mr-4 self-start", "bg-muted text-foreground"),
            )}
          >
            <span>{message.text}</span>
            <div className="flex shrink-0 translate-y-0.5 items-center gap-2 self-end text-xs text-muted-foreground">
              <span>{getMessageTime(message.createdAt)}</span>
              {isUserMessage && (
                <div className="flex shrink-0 items-center">
                  <Check size={13} />
                  {message.seen && <Check size={13} className="-ml-2" />}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
