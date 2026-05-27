export const getImageKeyFromUrl = (imageUrl: string): string => {
  const key = new URL(imageUrl).pathname.split("/").filter(Boolean).at(-1);

  if (!key) {
    throw new Error("Invalid image URL");
  }

  return key;
};
