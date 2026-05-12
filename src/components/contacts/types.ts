import type { User, Message } from "@/generated/prisma/client";

export type UserType = User & {
  messagesSent: Message[];
  messagesReceived: Message[];
};
