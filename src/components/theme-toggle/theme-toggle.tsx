import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={handleToggle} className={cn("rounded p-2 transition", "hover:bg-muted")}>
      <Sun size={20} className="block dark:hidden" />
      <Moon size={20} className="hidden dark:block" />
    </button>
  );
};

export { ThemeToggle };
