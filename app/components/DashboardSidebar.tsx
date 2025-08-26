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
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../admin/slices/slice/authSlice";
import { toast } from "@/hooks/use-toast";
import { MenuItem } from "./MenuItems";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { fetchAdminInfo } from "../admin/slices/slice/adminslice";
// import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function DashboardSidebar() {
  // const { setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: admin,
    isLoad,
    isthereError,
  } = useSelector((state: RootState) => state.admin);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    dispatch(fetchAdminInfo());
  }, [dispatch]);

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
    <div className="h-full flex flex-col bg-transparent text-gray-800 dark:text-white">
      {/* Header */}
      <div className="px-4 py-4 flex justify-between items-center">
        {!collapsed && (
          <h2
            className="text-lg font-bold cursor-pointer hover:text-primary flex items-center gap-2 justify-center w-full"
            onClick={() => handleNavigation("/admin/dashboard")}
          >
            <Image
              src={"/taxi-dark.png"}
              alt="Demo Taxi Logo"
              width={24}
              height={24}
              className="h-6 w-6 dark:invert"
              aria-label="Demo Taxi Logo"
            />
            Demo Taxi
          </h2>
        )}
        <button
          onClick={mobile ? toggleMobileSidebar : toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {mobile ? <X size={24} /> : collapsed ? <Menu /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-[#F7AB0A]/80 scroll-smooth">
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
            icon: List,
            label: "Schedule Rides List",
            path: "/admin/dashboard/ScheduleBookingList",
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
          const pathname =
            typeof window !== "undefined" ? window.location.pathname : "";
          const isActive =
            pathname === item.path ||
            (item.path !== "/admin/dashboard" &&
              pathname.startsWith(item.path));
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
        <div className="mt-2">
          {isLoad ? (
            <span className="text-gray-500 text-sm">
              Loading admin details...
            </span>
          ) : isthereError ? (
            <span className="text-red-500 text-sm">{isthereError}</span>
          ) : admin ? (
            collapsed ? (
              <div className="flex items-center justify-center w-10 h-10  rounded-full bg-[#BAFB5D] dark:bg-[#23272f] shadow-inner flex-shrink-0 mx-auto sm:mx-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#BAFB5D] dark:bg-[#23272f] shadow-inner transition hover:ring-2 hover:ring-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/80"
                      aria-label="Open admin menu"
                    >
                      <span className="text-lg font-bold text-gray-900 dark:text-[#BAFB5D]">
                        {admin?.name?.[0]?.toUpperCase() || "A"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white dark:bg-[#18181b] shadow-lg rounded-xl p-0 border-0 mb-4 min-w-[260px]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gradient-to-r from-[#bafb5d33] to-[#e0e7ff33] dark:from-[#23272f] dark:to-[#bafb5d22] rounded-xl px-3 py-2 sm:px-4 sm:py-3 ">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#BAFB5D] dark:bg-[#23272f] shadow-inner flex-shrink-0 mx-auto sm:mx-0">
                        <span className="text-lg font-bold text-gray-900 dark:text-[#BAFB5D]">
                          {admin?.name?.[0]?.toUpperCase() || "A"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full min-w-0">
                        <span className="font-semibold text-gray-900 dark:text-[#BAFB5D] text-base tracking-wide truncate w-full">
                          {admin?.name?.toUpperCase()}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 text-xs flex items-center gap-1 justify-center sm:justify-start w-full truncate">
                          <svg
                            className="w-4 h-4 text-gray-400 dark:text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4"
                            ></path>
                          </svg>
                          <span className="truncate">{admin?.email}</span>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic w-full">
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium capitalize">
                            {admin?.role}
                          </span>
                        </span>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <span className="text-lg font-bold text-gray-900 dark:text-[#BAFB5D]">
                  {admin?.name?.[0]?.toUpperCase() || "A"}
                </span> */}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gradient-to-r from-[#bafb5d33] to-[#e0e7ff33] dark:from-[#23272f] dark:to-[#bafb5d22] rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-md border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#BAFB5D] dark:bg-[#23272f] shadow-inner flex-shrink-0 mx-auto sm:mx-0">
                  <span className="text-lg font-bold text-gray-900 dark:text-[#BAFB5D]">
                    {admin?.name?.[0]?.toUpperCase() || "A"}
                  </span>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-[#BAFB5D] text-base tracking-wide truncate w-full">
                    {admin?.name?.toUpperCase()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 text-xs flex items-center gap-1 justify-center sm:justify-start w-full truncate">
                    <svg
                      className="w-4 h-4 text-gray-400 dark:text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4"
                      ></path>
                    </svg>
                    <span className="truncate">{admin?.email}</span>
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic w-full">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium capitalize">
                      {admin?.role}
                    </span>
                  </span>
                </div>
              </div>
            )
          ) : (
            <span className="text-gray-500 text-sm">
              No admin details found.
            </span>
          )}
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          className="w-full px-6 py-4 flex items-center justify-center gap-3 text-lg bg-black text-white dark:bg-[#BAFB5D] dark:text-black rounded-full transition-colors shadow tracking-wider hover:bg-gray-900 dark:hover:bg-[#d6ff7f]"
          //  className="mt-4 sm:mt-0 px-6 py-4 text-lg bg-black dark:bg-[#BAFB5D] rounded-full transition-colors flex items-center gap-3 shadow hover:scale-[1.05] tracking-wider"
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
            className="absolute inset-0 bg-[#252428] opacity-30"
            onClick={toggleMobileSidebar}
          ></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen transition-all duration-300 shadow-lg border-0 dark:bg-[#252428] ${
          isCollapsed ? "w-20" : "w-78"
        }`}
      >
        {SidebarContent(isCollapsed)}
      </aside>
    </>
  );
}
