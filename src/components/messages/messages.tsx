import type { Message } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Route as HomeRoute } from "@/routes/index";
import { useEffect, useRef } from "react";

const useAutoScroll = (chat: Message[] | null) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chat]);

  return { containerRef };
};

export const Messages = () => {
  const { chat } = HomeRoute.useLoaderData();
  const { currentUser } = HomeRoute.useRouteContext();

  const { containerRef } = useAutoScroll(chat);

  if (!chat) return null;

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
              "rounded-lg p-2 text-sm",
              isUserMessage
                ? cn("self-end", "bg-foreground text-background")
                : cn("self-start", "bg-muted text-foreground"),
            )}
          >
            {message.text}
          </div>
        );
      })}
    </div>
  );
};
