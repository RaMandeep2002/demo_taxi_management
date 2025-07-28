import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isCollapsed?: boolean;
  active?: boolean;
}

export function MenuItem({ icon: Icon, label, onClick, isCollapsed, active }: MenuItemProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "w-full mb-3 rounded-lg flex items-center transition-all duration-300 min-h-12",
        isCollapsed ? "justify-center p-2" : "justify-start px-4 py-3 gap-3",
        active
          ? "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white border-white dark:border-white"
          : "bg-white dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-zinc-700"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        size={22}
        className={cn(
          isCollapsed ? "" : "mr-2",
          active ? "text-black dark:text-white" : "text-black dark:text-white"
        )}
      />
      {!isCollapsed && (
        <span className="truncate">{label}</span>
      )}
    </Button>
  );
}
