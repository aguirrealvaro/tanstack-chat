import { cn } from "@/lib/utils";
import { ChevronDown, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DropdownMessageMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const DropdownMessageMenu = ({
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: DropdownMessageMenuProps) => {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer",
            "pointer-events-none opacity-0",
            "group-hover:pointer-events-auto group-hover:opacity-100",
          )}
        >
          <ChevronDown size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuItem onSelect={onEdit}>
          <Edit /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
