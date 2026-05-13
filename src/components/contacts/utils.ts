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

const compareDates = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const getMessageTime = (date: Date) => {
  const now = new Date();

  if (compareDates(date, now)) {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (compareDates(date, yesterday)) {
    return "Yesterday";
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
