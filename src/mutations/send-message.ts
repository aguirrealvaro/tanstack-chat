import type { Message } from "@/generated/prisma/client";
import { sendMessage } from "@/server-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Route as HomeRoute } from "@/routes/index";

type SendMessageMutation = {
  message: string;
  selectedUser: number;
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const { currentUser } = HomeRoute.useRouteContext();

  const optimisticUpdateMessages = async (data: SendMessageMutation) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["chat", data.selectedUser] });

    const previousMessages = queryClient.getQueryData<Message[]>(["chat", data.selectedUser]);

    const messageToAdd = {
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      text: data.message,
      fromId: currentUser.id,
      toId: data.selectedUser,
      seen: false,
    };

    const newMessages = previousMessages
      ? [...previousMessages, messageToAdd]
      : [messageToAdd];

    queryClient.setQueryData(["chat", data.selectedUser], newMessages);

    return { previousMessages };
  };

  return useMutation({
    mutationFn: ({ message, selectedUser: toUserId }: SendMessageMutation) =>
      sendMessage({ data: { message, selectedUser: toUserId } }),
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
