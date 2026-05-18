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
import { useEditMessageMutation } from "@/mutations/edit-message";

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
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </AlertDialogDescription>

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
