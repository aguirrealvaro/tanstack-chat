import { Route as HomeRoute } from "@/routes/index";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useSendMessageMutation } from "@/mutations";
import { useEffect, useRef } from "react";

export const InputMessage = () => {
  const { user: selectedUser } = HomeRoute.useSearch();

  const { mutate, isPending } = useSendMessageMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedUser) return;
    inputRef.current?.focus();
  }, [selectedUser]);

  if (!selectedUser) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = (formData.get("message") as string).trim();

    if (!message) return;

    const resetForm = () => {
      form.reset();
    };

    mutate({ message, selectedUser, resetForm });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-between gap-4">
      <input
        ref={inputRef}
        type="text"
        name="message"
        placeholder="Type a message..."
        className="flex-1 rounded border bg-transparent p-2"
      />
      <button
        type="submit"
        disabled={isPending}
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
