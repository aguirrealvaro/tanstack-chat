import { sendMessage } from "@/server-fns";
import { Route as HomeRoute } from "@/routes/index";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export const InputMessage = () => {
  const { user: userSelected } = HomeRoute.useSearch();
  const router = useRouter();

  if (!userSelected) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get("message") as string;

    if (!message.trim()) return;

    await sendMessage({ data: { message, userSelected } });
    form.reset();
    router.invalidate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-between gap-4">
      <input
        type="text"
        name="message"
        placeholder="Type a message..."
        className="flex-1 rounded border bg-transparent p-2"
      />
      <button
        type="submit"
        className={cn(
          "bg-foreground text-background",
          "rounded px-4 py-2",
          "disabled:opacity-50",
        )}
      >
        <Send size={18} />
      </button>
    </form>
  );
};
