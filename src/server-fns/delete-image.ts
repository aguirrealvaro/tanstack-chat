import { createServerFn } from "@tanstack/react-start";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { authMiddleware } from "./auth-middleware";

const utapi = new UTApi();

export const deleteImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ fileKey: z.string().min(1) }))
  .handler(async ({ data: { fileKey } }) => {
    await utapi.deleteFiles(fileKey);

    return { message: "Image deleted" };
  });
