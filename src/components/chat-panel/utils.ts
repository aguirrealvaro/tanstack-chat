import { isSameDay } from "date-fns";

export const getMessageTime = (date: Date) => {
  const time = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();

  if (isSameDay(date, now)) {
    return time;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return `Yesterday ${time}`;
  }

  const day = date.toLocaleDateString();

  return `${day} ${time}`;
};
