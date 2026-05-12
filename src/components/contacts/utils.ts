import type { UserType } from "./types";

export const getLastMessage = (user: UserType) => {
  const lastMessageReceived = user.messagesReceived[user.messagesReceived.length - 1];
  const lastMessageSent = user.messagesSent[user.messagesSent.length - 1];

  if (!lastMessageReceived && !lastMessageSent) {
    return undefined;
  }

  if (lastMessageReceived && !lastMessageSent) {
    return lastMessageReceived;
  }

  if (!lastMessageReceived && lastMessageSent) {
    return lastMessageSent;
  }

  if (lastMessageReceived && lastMessageSent) {
    return lastMessageSent.createdAt > lastMessageReceived.createdAt
      ? lastMessageSent
      : lastMessageReceived;
  }

  return undefined;
};
