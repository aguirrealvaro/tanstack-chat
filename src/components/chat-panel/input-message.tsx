import { sendMessage } from "@/server-fns";
import { Route as HomeRoute } from "@/routes/index";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SendMessageMutation = {
  message: string;
  selectedUser: number;
};

export const InputMessage = () => {
  const { user: selectedUser } = HomeRoute.useSearch();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: ({ message, selectedUser: toUserId }: SendMessageMutation) =>
      sendMessage({ data: { message, selectedUser: toUserId } }),
    onSuccess: (_response, data) => {
      const { selectedUser: toUserId } = data;
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["chat", toUserId] });
    },
  });

  if (!selectedUser) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = (formData.get("message") as string).trim();

    if (!message) return;

    sendMessageMutation.mutate(
      { message, selectedUser },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
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
        disabled={sendMessageMutation.isPending}
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
