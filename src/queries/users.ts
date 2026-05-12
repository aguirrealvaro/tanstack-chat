import { queryOptions } from "@tanstack/react-query";
import { getUsers } from "@/server-fns";

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
