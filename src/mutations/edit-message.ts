import { editMessage } from "@/server-fns/edit-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Route as HomeRoute } from "@/routes/index";

type EditMessageMutation = {
  messageId: number;
  newMessageValue: string;
};

export const useEditMessageMutation = () => {
  const { user: selectedUser } = HomeRoute.useSearch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, newMessageValue }: EditMessageMutation) =>
      editMessage({ data: { messageId, newMessageValue } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["chat", selectedUser] });
    },
  });
};
