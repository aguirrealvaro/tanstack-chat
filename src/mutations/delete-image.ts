import { deleteImage } from "@/server-fns";
import { useMutation } from "@tanstack/react-query";

type DeleteImageMutation = {
  fileKey: string;
};

export const useDeleteImageMutation = () => {
  return useMutation({
    mutationFn: ({ fileKey }: DeleteImageMutation) => deleteImage({ data: { fileKey } }),
  });
};
