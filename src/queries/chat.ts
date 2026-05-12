import { queryOptions } from "@tanstack/react-query";
import { getChat } from "@/server-fns";

export const chatQueryOptions = (selectedUser: number) =>
  queryOptions({
    queryKey: ["chat", selectedUser],
    queryFn: () => getChat({ data: selectedUser }),
  });
