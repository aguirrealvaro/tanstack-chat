import { Route as HomeRoute } from "@/routes/index";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components";
import { Loader2, Plus, Send, X } from "lucide-react";
import { useDeleteImageMutation, useSendMessageMutation } from "@/mutations";
import { useEffect, useRef, useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

export const InputMessage = () => {
  const [previewImage, setPreviewImage] = useState<{ key: string; url: string } | undefined>(
    undefined,
  );
  const { user: selectedUser } = HomeRoute.useSearch();

  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessageMutation();
  const { mutate: deletePreviewImage, isPending: isDeletingImage } = useDeleteImageMutation();
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
      setPreviewImage(undefined);
    };

    sendMessage({ message, selectedUser, imageUrl: previewImage?.url, resetForm });
  };

  const handleClearImage = () => {
    if (!previewImage || isDeletingImage) return;

    deletePreviewImage(
      { fileKey: previewImage.key },
      { onSuccess: () => setPreviewImage(undefined) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-between gap-4">
      <div className="flex flex-1 gap-4 rounded border bg-transparent p-2">
        <UploadButton
          endpoint="imageUploader"
          config={{ cn }}
          appearance={{
            container: "gap-0",
            button: cn(
              "h-auto min-h-0 w-auto p-0",
              "bg-transparent text-foreground shadow-none",
              "ring-0 after:hidden focus-within:ring-0 focus-within:ring-offset-0",
              "data-[state=ready]:bg-transparent",
              "data-[state=readying]:bg-transparent",
              "data-[state=uploading]:bg-transparent",
              "data-[state=disabled]:bg-transparent",
            ),
            allowedContent: "hidden",
          }}
          content={{
            button({ ready, isUploading }) {
              const isLoading = !ready || isUploading;

              return isLoading ? <LoadingSpinner /> : <Plus size={18} />;
            },
            allowedContent: "",
          }}
          onClientUploadComplete={(res) => {
            const image = res[0];
            if (!image) return;

            setPreviewImage({ key: image.key, url: image.ufsUrl });
          }}
        />
        {previewImage && (
          <div className="flex items-center gap-1 bg-muted text-sm">
            <a href={previewImage.url} target="_blank" rel="noopener noreferrer">
              Image
            </a>
            <button
              type="button"
              onClick={handleClearImage}
              disabled={isDeletingImage}
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeletingImage ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <X size={14} />
              )}
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          name="message"
          placeholder="Type a message..."
          className="w-full border-0 bg-transparent outline-none focus-visible:ring-0"
        />
      </div>
      <button
        type="submit"
        disabled={isSendingMessage}
        className={cn(
          "bg-foreground text-background",
          "rounded px-4 py-2",
          "disabled:opacity-50",
        )}
      >
        {isSendingMessage ? <LoadingSpinner /> : <Send size={18} />}
      </button>
    </form>
  );
};
