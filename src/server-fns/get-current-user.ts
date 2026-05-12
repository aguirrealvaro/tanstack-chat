import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth-middleware";

export const getCurrentUser = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { currentUser } }) => {
    return currentUser;
  });
