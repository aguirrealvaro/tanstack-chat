import type { Message } from "@/generated/prisma/client";
import { sendMessage } from "@/server-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Route as HomeRoute } from "@/routes/index";

type SendMessageMutation = {
  message: string;
  imageUrl?: string;
  selectedUser: number;
  resetForm?: () => void;
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const { loggedInUser } = HomeRoute.useRouteContext();

  const optimisticUpdateMessages = async (data: SendMessageMutation) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["chat", data.selectedUser] });

    const previousMessages = queryClient.getQueryData<Message[]>(["chat", data.selectedUser]);

    const messageToAdd: Message = {
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      text: data.message,
      imageUrl: data.imageUrl || null,
      fromId: loggedInUser.id,
      toId: data.selectedUser,
      seen: false,
      edited: false,
    };

    const newMessages = previousMessages
      ? [...previousMessages, messageToAdd]
      : [messageToAdd];

    queryClient.setQueryData(["chat", data.selectedUser], newMessages);

    data.resetForm?.();

    return { previousMessages };
  };

  return useMutation({
    mutationFn: ({ message, imageUrl, selectedUser: toUserId }: SendMessageMutation) =>
      sendMessage({ data: { message, imageUrl, selectedUser: toUserId } }),
    onMutate: async (data) => {
      const { previousMessages } = await optimisticUpdateMessages(data);
      return { previousMessages };
    },
    onError: (_error, data, context) => {
      if (!context) return;
      queryClient.setQueryData(["chat", data.selectedUser], context.previousMessages);
    },
    onSuccess: (_response, data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["chat", data.selectedUser] });
    },
  });
};
