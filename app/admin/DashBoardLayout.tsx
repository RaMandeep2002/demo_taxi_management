"use client";

import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";    
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
  // const pathSegments = pathname.split("/").filter(Boolean);
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
        {/* <nav className="shadow-lg dark:bg-[#252428] transition p-4">
          <ul className="flex space-x-2 overflow-x-auto text-base sm:text-lg">
            {pathSegments.slice(1).map((segment, index) => {
              const path = `/${pathSegments.slice(0, index + 2).join("/")}`;
              return (
                <li key={path} className="flex items-center whitespace-nowrap">
                  {index > 0 && (
                    <span className="mx-1 text-gray-400 dark:text-gray-500">
                      <span className="mx-1 text-gray-400 dark:text-gray-500 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="inline-block"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </span>
                  )}
                  <Link
                    href={path}
                    className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base sm:text-lg"
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
        </nav> */}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-fuchsia-100 dark:from-[#252428] dark:via-[#34363F] dark:to-[#1a1a2e] transition-colors">
          <div className="w-full max-w-full mx-auto space-y-6">
            {children}
          </div>
        </main>


        {/* <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-fuchsia-100 dark:from-[#252428] dark:via-[#34363F] dark:to-[#1a1a2e] transition-colors">
          <div className="w-full max-w-full mx-auto space-y-6">{children}</div>
        </main> */}
      </div>
    </div>
  );
}
