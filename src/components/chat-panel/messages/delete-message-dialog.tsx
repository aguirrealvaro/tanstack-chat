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
import { useDeleteMessageMutation } from "@/mutations/delete-message";

type DeleteMessageDialogProps = {
  messageId: number | null;
  onOpenChange: (open: boolean) => void;
};

export const DeleteMessageDialog = ({ messageId, onOpenChange }: DeleteMessageDialogProps) => {
  const { mutate, isPending } = useDeleteMessageMutation();

  const handleDeleteMessage = () => {
    if (!messageId) return;
    mutate({ messageId });
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
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteMessage}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
