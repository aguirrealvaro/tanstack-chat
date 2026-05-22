import { createFileRoute } from "@tanstack/react-router";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";
import { prisma } from "@/db";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

export const Route = createFileRoute("/api/webhooks/clerk")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!WEBHOOK_SECRET) {
          return new Response("Missing WEBHOOK_SECRET", {
            status: 500,
          });
        }

        const svixId = request.headers.get("svix-id");
        const svixTimestamp = request.headers.get("svix-timestamp");
        const svixSignature = request.headers.get("svix-signature");

        if (!svixId || !svixTimestamp || !svixSignature) {
          return new Response("Missing svix headers", {
            status: 400,
          });
        }

        const body = await request.text();

        const wh = new Webhook(WEBHOOK_SECRET);

        let evt: WebhookEvent;

        try {
          evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
          }) as WebhookEvent;
        } catch (err) {
          return new Response("Invalid signature", {
            status: 400,
          });
        }

        // USER CREATED / UPDATED
        if (evt.type === "user.created" || evt.type === "user.updated") {
          const {
            id,
            first_name,
            last_name,
            image_url,
            email_addresses,
            primary_email_address_id,
          } = evt.data;

          const email =
            // eslint-disable-next-line no-shadow
            email_addresses.find((email) => email.id === primary_email_address_id)
              ?.email_address || "";

          const newFields = {
            firstName: first_name || "",
            lastName: last_name || "",
            email,
            imageUrl: image_url || "",
          };

          await prisma.user.upsert({
            where: {
              clerkId: id,
            },
            create: {
              clerkId: id,
              ...newFields,
            },
            update: newFields,
          });
        }

        // USER DELETED
        if (evt.type === "user.deleted") {
          const { id } = evt.data;

          if (id) {
            await prisma.user.deleteMany({
              where: {
                clerkId: id,
              },
            });
          }
        }

        return new Response("OK", {
          status: 200,
        });
      },
    },
  },
});
