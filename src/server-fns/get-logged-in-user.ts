import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth-middleware";

export const getLoggedInUser = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { loggedInUser } }) => {
    return loggedInUser;
  });
