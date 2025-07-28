"use client";

import {
  Home,
  ChevronLeft,
  Plus,
  Users2,
  ListChecksIcon,
  Settings,
  LogOut,
  Menu,
  Clock,
  CarTaxiFront,
  SquareChartGantt,
  AlarmClock,
  UserRoundCog,
  UserPlus,
  MenuIcon,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../admin/slices/slice/authSlice";
import { toast } from "@/hooks/use-toast";
import { MenuItem } from "./MenuItems";
import { useState } from "react";
import { AppDispatch } from "../store/store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardSidebar() {
  const { setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Successful Logout",
      description: "Redirecting to Login Page ...",
    });
    router.push("/admin/login");
    setIsMobileSidebarOpen(false);
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  const SidebarContent = (collapsed: boolean, mobile?: boolean) => (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-800 text-gray-800 dark:text-white">
      {/* Header */}
      <div className="px-4 py-4 flex justify-between items-center">
        {!collapsed && (
          <h2
            className="text-lg font-bold cursor-pointer hover:text-primary"
            onClick={() => handleNavigation("/admin/dashboard")}
          >
            Demo Taxi
          </h2>
        )}
        <button
          onClick={mobile ? toggleMobileSidebar : toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {mobile ? (
            <X size={24} />
          ) : collapsed ? (
            <Menu />
          ) : (
            <ChevronLeft />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-4 overflow-y-auto">
        {[
          {
            icon: Home,
            label: "Dashboard",
            path: "/admin/dashboard",
          },
          {
            icon: AlarmClock,
            label: "Schedule Ride",
            path: "/admin/dashboard/ScheduleRide",
          },
          {
            icon: Plus,
            label: "Add Driver",
            path: "/admin/dashboard/AddDriver",
          },
          {
            icon: Users2,
            label: "Drivers",
            path: "/admin/dashboard/DriverList",
          },
          {
            icon: Plus,
            label: "Register Vehicle",
            path: "/admin/dashboard/RegsiterVehicle",
          },
          {
            icon: CarTaxiFront,
            label: "Vehicles",
            path: "/admin/dashboard/VehicleList",
          },
          {
            icon: SquareChartGantt,
            label: "Shift Management",
            path: "/admin/dashboard/ShiftManagement",
          },
          {
            icon: Clock,
            label: "Booking History",
            path: "/admin/dashboard/Bookings",
          },
          {
            icon: ListChecksIcon,
            label: "Reports",
            path: "/admin/dashboard/Reports/",
          },
          {
            icon: UserPlus,
            label: "Add Admins",
            path: "/admin/dashboard/AddAdmin",
          },
          {
            icon: UserRoundCog,
            label: "Admins",
            path: "/admin/dashboard/AdminList",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/admin/dashboard/Settings/",
          },
        ].map((item) => {
          // Get current path from Next.js router
          // For active status, check if current path starts with item.path
          // (for exact match, use pathname === item.path)
          // You may want to import usePathname from "next/navigation" at the top
          // and add: const pathname = usePathname();
          // For this file, add at the top: import { usePathname } from "next/navigation";
          // and inside the component: const pathname = usePathname();
          // Here, we assume pathname is available.
          const pathname = typeof window !== "undefined" ? window.location.pathname : "";
          const isActive =
            pathname === item.path ||
            (item.path !== "/admin/dashboard" && pathname.startsWith(item.path));
          return (
            <MenuItem
              key={item.path}
              icon={item.icon}
              label={!collapsed ? item.label : ""}
              onClick={() => handleNavigation(item.path)}
              isCollapsed={collapsed}
              // Pass active status as a prop, you need to update MenuItem to accept "active"
              active={isActive}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 space-y-3">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="w-full flex items-center justify-center border border-gray-200 dark:border-zinc-700">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
        >
          {collapsed ? <LogOut /> : "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Button */}
      {!isMobileSidebarOpen && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 block md:hidden p-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg shadow-lg hover:bg-yellow-500 transition-colors"
        >
          <MenuIcon size={28} />
        </button>
      )}

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <aside className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50">
            {SidebarContent(false, true)}
          </aside>
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={toggleMobileSidebar}
          ></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen transition-all duration-300 shadow-lg ${
          isCollapsed ? "w-20" : "w-72"
        } bg-white dark:bg-gray-900`}
      >
        {SidebarContent(isCollapsed)}
      </aside>
    </>
  );
}
