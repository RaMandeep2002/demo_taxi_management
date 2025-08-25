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
      className={cn(
        "mt-4 group text-md w-full mb-3 rounded-full flex items-center transition-all duration-200 min-h-12 shadow-none border-0",
        isCollapsed ? "justify-center p-2" : "justify-start px-4 py-3 gap-3",
        "bg-transparent",
        "hover:bg-gray-100 dark:hover:bg-[#BAFB5D]/80 hover:scale-[1.035]",
        active
          ? "bg-gray-200 dark:bg-[#BAFB5D] dark:bg-[#BAFB5D]/80 text-black dark:text-zinc-900 font-semibold shadow-md"
          : "bg-transparent text-gray-800 dark:text-white font-medium",
        !active && "dark:hover:text-black"
      )}
      aria-current={active ? "page" : undefined}
      tabIndex={0}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full transition-colors duration-200",
          active
            ? ""
            : "bg-transparent",
          "p-2"
        )}
      >
        <Icon
          size={22}
          className={cn(
            isCollapsed ? "" : "mr-2",
            active
              ? "text-yellow-700 dark:text-zinc-900"
              : "text-gray-700 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-black"
          )}
        />
      </span>
      {!isCollapsed && (
        <span
          className={cn(
            "truncate transition-colors duration-200",
            active
              ? "text-black dark:text-zinc-900 font-semibold"
              : "text-gray-800 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-black"
          )}
        >
          {label}
        </span>
      )}
    </Button>
  );
}
