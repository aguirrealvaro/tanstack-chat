import type { Message } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Route as HomeRoute } from "@/routes/index";
import { chatQueryOptions } from "@/queries/chat";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getMessageTime } from "./utils";
import { DoubleCheck } from "../double-check";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const useAutoScroll = (chat: Message[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastId = chat.at(-1)?.id;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lastId]);

  return { containerRef };
};

export const Messages = () => {
  const { user: selectedUser } = HomeRoute.useSearch();
  const { loggedInUser } = HomeRoute.useRouteContext();
  const { data: chat } = useSuspenseQuery(chatQueryOptions(selectedUser));

  const { containerRef } = useAutoScroll(chat);

  return (
    <div
      className="-mr-4 flex h-0 flex-col gap-2 overflow-y-auto pr-4 break-all"
      style={{ flex: "1 1 auto" }}
      ref={containerRef}
    >
      {chat.map((message) => {
        const isUserMessage = message.fromId === loggedInUser.id;

        return (
          <div
            key={message.id}
            className={cn(
              "group relative",
              "flex flex-row gap-4 rounded-lg p-2 text-sm",
              isUserMessage
                ? cn("ml-4 self-end", "bg-foreground text-background")
                : cn("mr-4 self-start", "bg-muted text-foreground"),
            )}
          >
            <span>{message.text}</span>
            <div className="flex shrink-0 translate-y-0.5 items-center gap-2 self-end text-xs text-muted-foreground">
              <span>{getMessageTime(message.createdAt)}</span>
              {isUserMessage && <DoubleCheck seen={message.seen} />}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer",
                    "pointer-events-none opacity-0",
                    "group-hover:pointer-events-auto group-hover:opacity-100",
                  )}
                >
                  <ChevronDown size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4}>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
};
