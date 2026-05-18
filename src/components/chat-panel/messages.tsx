import type { Message } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Route as HomeRoute } from "@/routes/index";
import { chatQueryOptions } from "@/queries/chat";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getMessageTime } from "./utils";
import { DoubleCheck } from "../double-check";
import { ChevronDown, Edit, Trash } from "lucide-react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDeleteMessageMutation } from "@/mutations/delete-message";
import { useLongPress } from "use-long-press";
import { useEditMessageMutation } from "@/mutations/edit-message";

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

  const { containerRef } = useAutoScroll(chat);

  const { mutate: mutateEditMessage, isPending: isEditing } = useEditMessageMutation();
  const handleEditMessage = (messageId: number | null, newMessageValue: string) => {
    if (!messageId) return;
    mutateEditMessage({ messageId, newMessageValue });
  };

  const { mutate: mutateDeleteMessage, isPending: isDeleting } = useDeleteMessageMutation();
  const handleDeleteMessage = (messageId: number | null) => {
    if (!messageId) return;
    mutateDeleteMessage({ messageId });
  };

  const bindLongPress = useLongPress<HTMLDivElement, number>((_, { context }) => {
    if (context) {
      setDropdownMessageId(context);
    }
  });

  const editedMessageValue = chat.find((message) => message.id === editAlertMessageId)?.text;

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
            <span>{message.text}</span>
            <div className="flex shrink-0 translate-y-0.5 items-center gap-2 self-end text-xs text-muted-foreground">
              <span>{getMessageTime(message.createdAt)}</span>
              {isUserMessage && <DoubleCheck seen={message.seen} />}
            </div>
            {isUserMessage && (
              <DropdownMenu
                open={dropdownMessageId === message.id}
                onOpenChange={(open) => {
                  setDropdownMessageId(open ? message.id : null);
                }}
              >
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
                  <DropdownMenuItem onSelect={() => setEditAlertMessageId(message.id)}>
                    <Edit /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setDeleteAlertMessageId(message.id)}
                  >
                    <Trash />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}

      {/* Edit Alert Dialog */}
      <AlertDialog
        open={Boolean(editAlertMessageId)}
        onOpenChange={(open) => {
          if (!open) setEditAlertMessageId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit message</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription>
            <input
              type="text"
              name="message"
              placeholder="Type a message..."
              className="w-full flex-1 rounded border bg-transparent p-2 text-primary"
              defaultValue={editedMessageValue}
            />
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleEditMessage(editAlertMessageId, "new message value")}
              disabled={isEditing}
            >
              {isEditing ? "Editing..." : "Edit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteAlertMessageId) || isDeleting}
        onOpenChange={(open) => {
          if (!open) setDeleteAlertMessageId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently edit your message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteMessage(deleteAlertMessageId);
              }}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
