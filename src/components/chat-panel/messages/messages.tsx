import type { Message } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Route as HomeRoute } from "@/routes/index";
import { chatQueryOptions } from "@/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getMessageTime } from "../utils";
import { DoubleCheck } from "../../double-check";
import { useLongPress } from "use-long-press";
import { DropdownMessageMenu } from "./dropdown-message-menu";
import { EditMessageDialog } from "./edit-message-dialog";
import { DeleteMessageDialog } from "./delete-message-dialog";

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

  const [dropdownMessageId, setDropdownMessageId] = useState<number | null>(null);
  const [deleteAlertMessageId, setDeleteAlertMessageId] = useState<number | null>(null);
  const [editAlertMessageId, setEditAlertMessageId] = useState<number | null>(null);

  const [editedInputValue, setEditedInputValue] = useState("");

  const { containerRef } = useAutoScroll(chat);

  const bindLongPress = useLongPress<HTMLDivElement, number>((_, { context }) => {
    if (context) {
      setDropdownMessageId(context);
    }
  });

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
            {...(isUserMessage ? bindLongPress(message.id) : {})}
            className={cn(
              "group relative",
              "flex flex-row gap-4 rounded-lg p-2 text-sm",
              isUserMessage
                ? cn("ml-4 self-end", "bg-foreground text-background")
                : cn("mr-4 self-start", "bg-muted text-foreground"),
            )}
          >
            <div className="flex flex-col gap-2">
              {message.imageUrl && (
                <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={message.imageUrl}
                    alt={`Message image ${message.id}`}
                    className="size-32"
                  />
                </a>
              )}
              {message.text && <span>{message.text}</span>}
            </div>

            <div className="flex shrink-0 translate-y-0.5 items-center gap-2 self-end text-xs text-muted-foreground">
              {message.edited && <span>Edited</span>}
              <span>{getMessageTime(message.createdAt)}</span>
              {isUserMessage && <DoubleCheck seen={message.seen} />}
            </div>
            {isUserMessage && (
              <DropdownMessageMenu
                open={dropdownMessageId === message.id}
                onOpenChange={(open) => {
                  setDropdownMessageId(open ? message.id : null);
                }}
                onEdit={() => {
                  setEditAlertMessageId(message.id);
                  setEditedInputValue(message.text);
                }}
                onDelete={() => setDeleteAlertMessageId(message.id)}
              />
            )}
          </div>
        );
      })}

      <EditMessageDialog
        messageId={editAlertMessageId}
        value={editedInputValue}
        onValueChange={setEditedInputValue}
        onOpenChange={() => setEditAlertMessageId(null)}
      />

      <DeleteMessageDialog
        messageId={deleteAlertMessageId}
        onOpenChange={() => setDeleteAlertMessageId(null)}
      />
    </div>
  );
};
