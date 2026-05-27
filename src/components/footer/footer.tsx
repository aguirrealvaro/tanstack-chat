import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer
      className={cn(
        "mb-4 items-center justify-center text-center text-sm text-muted-foreground",
        "hidden sm:flex",
      )}
    >
      <span>
        Made by{" "}
        <a
          href="https://www.aguirrealvaro.dev/"
          target="_blank"
          className="font-bold hover:underline"
        >
          aguirrealvaro
        </a>
      </span>
    </footer>
  );
};
