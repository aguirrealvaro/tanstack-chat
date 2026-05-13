import { queryOptions } from "@tanstack/react-query";
import { getChat } from "@/server-fns";

export const chatQueryOptions = (selectedUser?: number) =>
  queryOptions({
    queryKey: ["chat", selectedUser],
    queryFn: () => {
      if (!selectedUser) return [];
      return getChat({ data: selectedUser });
    },
    refetchInterval: import.meta.env.PROD ? 10 * 1000 : false,
    enabled: Boolean(selectedUser),
  });
