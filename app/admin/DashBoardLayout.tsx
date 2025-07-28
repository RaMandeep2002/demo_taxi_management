"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
// import HeaderDashboard from "../components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter(Boolean);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking, false = no token

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return null; // or loading spinner
  }

  if (!isAuthenticated) {
    return null; // fallback in case router.push doesn't finish fast enough
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <HeaderDashboard /> */}

        {/* Breadcrumb Navigation */}
        <nav className="shadow-md p-4 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
          <ul className="flex space-x-2 overflow-x-auto text-sm sm:text-base">
            {pathSegments.slice(1).map((segment, index) => {
              const path = `/${pathSegments.slice(0, index + 2).join("/")}`;
              return (
                <li key={path} className="flex items-center whitespace-nowrap">
                  {index > 0 && (
                    <span className="mx-1 text-gray-400 dark:text-gray-500">
                      /
                    </span>
                  )}
                  <Link
                    href={path}
                    className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {segment
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim()}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-zinc-900 transition-colors">
          <div className="max-w-full mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
