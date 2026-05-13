import { compareDates } from "@/utils";

export const getMessageTime = (date: Date) => {
  const time = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();

  if (compareDates(date, now)) {
    return time;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (compareDates(date, yesterday)) {
    return `Yesterday ${time}`;
  }

  const day = date.toLocaleDateString();

  return `${day} ${time}`;
};
