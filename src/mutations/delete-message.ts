import { deleteMessage } from "@/server-fns/delete-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Route as HomeRoute } from "@/routes/index";

type DeleteMessageMutation = {
  messageId: number;
};

export const useDeleteMessageMutation = () => {
  const { user: selectedUser } = HomeRoute.useSearch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId }: DeleteMessageMutation) =>
      deleteMessage({ data: { messageId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["chat", selectedUser] });
    },
  });
};
