import type { UserType } from "./types";
import { isSameDay } from "date-fns";

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

export const getMessageTime = (date: Date) => {
  const now = new Date();

  if (isSameDay(date, now)) {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
};
