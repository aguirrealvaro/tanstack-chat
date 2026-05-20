import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEditMessageMutation } from "@/mutations";
import { useRef } from "react";

type EditMessageDialogProps = {
  messageId: number | null;
  value: string;
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
};

export const EditMessageDialog = ({
  messageId,
  value,
  onValueChange,
  onOpenChange,
}: EditMessageDialogProps) => {
  const { mutate, isPending } = useEditMessageMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditMessage = () => {
    if (!messageId || !value) return;
    mutate({ messageId, newMessageValue: value });
  };

  return (
    <AlertDialog
      open={Boolean(messageId) || isPending}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <AlertDialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Edit message</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Edit the message text below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <input
          type="text"
          name="message"
          ref={inputRef}
          placeholder="Type a message..."
          className="w-full flex-1 rounded border bg-transparent p-2 text-primary"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEditMessage} disabled={isPending || !value}>
            {isPending ? "Editing..." : "Edit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
