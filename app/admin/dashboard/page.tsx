"use client";
import DashboardLayout from "../DashBoardLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/app/store/store";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { fetchBookingHistory } from "../slices/slice/booingHistorySlice";
import { Button } from "@/components/ui/button";
import { BookText, Car, Clock, Plus, Route, Users, Users2 } from "lucide-react";
import { fetchDashboardStats } from "../slices/slice/getCountSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { fetchdriverdetails } from "../slices/slice/fetchingDriversSlice";
import { fetchAdminInfo } from "../slices/slice/adminslice";
import * as motion from "motion/react-client";
// import { useDebounce } from "@/lib/useDebounce";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};
function StatCard({ title, value, icon }: StatCardProps) {
  return (
    // <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-200 via-violet-300 to-fuchsia-200 dark:from-violet-950 dark:via-purple-950 dark:to-fuchsia-950 transition"></Card>
    <div className="relative overflow-hidden rounded-xl  dark:dark:bg-[#34363F] shadow-lg transition group hover:scale-[1.025] hover:shadow-xl duration-200">
      <div className="flex flex-row items-center justify-between px-5 pt-5 pb-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-[#BAFB5D]">
            {title}
          </p>
        </div>
        <div className="bg-blue-500/10 rounded-full p-2 flex items-center justify-center shadow-inner">
          <span className="text-blue-600 dark:text-[#FBE4D8] text-xl">{icon}</span>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="text-3xl font-extrabold text-blue-900 dark:text-[#fffbf8] drop-shadow-sm">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [bookingPage, setBookingPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);
  const itemsPerPage = 6;

  const { data: drivers, isLoading , isthereerror} = useSelector(
    (state: RootState) => state.driversFetching
  );
  const { bookings, loading, error } = useSelector(
    (state: RootState) => state.fetchBookingHistory
  );
  const { data, iserror } = useSelector(
    (state: RootState) => state.dashboardStats
  );
  // const [searchTerm, setSearchTerm] = useState("");
  // const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(fetchBookingHistory());
    dispatch(fetchDashboardStats());
    dispatch(fetchdriverdetails());
    dispatch(fetchAdminInfo());
    // console.log("admin ---> ", admin)
  }, [dispatch]);

  // const filteredDrivers =
  // drivers?.filter((driver) => {
  //   const matchesSearch =
  //     driver.drivername
  //       .toLowerCase()
  //       .includes(debouncedSearch.toLowerCase()) ||
  //     driver.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
  //     driver.driverId.toLowerCase().includes(debouncedSearch.toLowerCase());
  //   return matchesSearch;
  // }) || [];

  const bookingTotalPages = Math.ceil(bookings.length / itemsPerPage);
  const driverTotalPages = Math.ceil(drivers.length / itemsPerPage);

  const paginatedBookings = bookings.slice(
    (bookingPage - 1) * itemsPerPage,
    bookingPage * itemsPerPage
  );
  const paginatedDrivers = drivers.slice(
    (driverPage - 1) * itemsPerPage,
    driverPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#BAFB5D] tracking-wider">
              Dashboard
            </h1>
            <motion.p
              
              className="text-gray-700 dark:text-gray-300 tracking-wider"

            >
              Welcome back! Here&apos;s what&apos;s happening with your taxi
              fleet today.
            </motion.p>
           
          </div>
          <Button
                  // className="w-full px-6 py-4 flex items-center justify-center gap-3 text-lg bg-black text-white dark:bg-[#BAFB5D] dark:text-black rounded-full transition-colors shadow tracking-wider hover:bg-gray-900 dark:hover:bg-[#d6ff7f]"
            className="mt-4 sm:mt-0 px-6 py-4 font-bold text-lg bg-black text-white dark:bg-[#BAFB5D] dark:text-black rounded-full transition-colors shadow tracking-wide hover:bg-gray-900 dark:hover:bg-[#d6ff7f]  flex items-center gap-3 hover:scale-[1.05] "
            onClick={() => {
              router.push("/admin/dashboard/Reports/");
            }}
          >
            <Plus size={20} />
            Report
          </Button>
        </div>
        <div className="mb-5">
          {iserror ? (
            <p className="text-red-600 dark:text-red-400 text-center text-sm sm:text-base col-span-3">
              {iserror}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Drivers"
                value={data.driverCount}
                icon={<Users className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />}
                // className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
              />
              <StatCard
                title="Total Vehicles"
                value={data.vehicleCount}
                icon={<Car className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />}
                // className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
              />
              <StatCard
                title="Total Rides"
                value={data.bookingCount}
                icon={<Route className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />}
                // className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
              />
              <StatCard
                title="Total Shifts"
                value={data.shiftsCount}
                icon={<BookText className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />}
                // className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
              />
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 mb-2 text-gray-900 dark:text-[#BAFB5D]">
                  <Clock className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Latest ride requests and completions
                </CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-700 dark:text-gray-300">Bookings</span>
                <span className="text-lg font-bold">
                  {data.bookingCount}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
              <div>
              <div className="text-center py-8">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span className="text-blue-700 dark:text-blue-300 font-medium text-base">Loading bookings...</span>
                </div>
              </div>
            </div>
              ) : error ? (
                <div className="text-center text-red-500 dark:text-red-400 py-8">{error}</div>
              ) : paginatedBookings.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No bookings found.
                </div>
              ) : (
                <>
                  {paginatedBookings.map((booking) => (
                    <div
                      key={booking.bookingId}
                   className="flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/70 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-[1.025]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-[#BAFB5D]">
                            #{booking.bookingId}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : booking.status === "ongoing"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {booking.status || "pending"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-400">
                          <span className="font-medium">
                            {booking.driver?.drivername
                              ? booking.driver.drivername.charAt(0).toUpperCase() + booking.driver.drivername.slice(1)
                              : "No driver assigned"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {booking.pickup?.address || "N/A"} →{" "}
                          {booking.dropOff?.address || "Ongoing"}
                        </p>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="font-medium text-gray-900 dark:text-gray-200">
                          ${booking.totalFare}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.pickupDate || "N/A"}{" "}
                          {booking.pickuptime ? `• ${booking.pickuptime}` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 sm:gap-0">
                    <Button
                      onClick={() =>
                        setBookingPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={bookingPage === 1}
                      className="text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800 w-full sm:w-auto border border-gray-200 dark:border-zinc-700 "
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Page {bookingPage} of {bookingTotalPages}
                    </span>
                    <Button
                      onClick={() =>
                        setBookingPage((prev) =>
                          Math.min(prev + 1, bookingTotalPages)
                        )
                      }
                      disabled={bookingPage === bookingTotalPages}
                      className="text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800 w-full sm:w-auto border border-gray-200 dark:border-zinc-700"
                    >
                      Next
                    </Button>
                  </div>  
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-[#BAFB5D]">
                  <Users2 className="h-5 w-5" />
                  Drivers
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Current driver status and earnings
                </CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-700 dark:text-gray-300">Drivers</span>
                <span className="text-lg font-bold">
                  {data.driverCount}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                 <div>
                 <div className="text-center py-8">
                   <div className="flex flex-col items-center justify-center gap-2">
                     <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle
                         className="opacity-25"
                         cx="12"
                         cy="12"
                         r="10"
                         stroke="currentColor"
                         strokeWidth="4"
                       ></circle>
                       <path
                         className="opacity-75"
                         fill="currentColor"
                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                       ></path>
                     </svg>
                     <span className="text-blue-700 dark:text-blue-300 font-medium text-base">Loading Drivers...</span>
                   </div>
                 </div>
               </div>
              ) : isthereerror ? (
                <div className="text-center text-red-500 dark:text-red-400 py-8">{isthereerror}</div>
              ) : paginatedDrivers.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No bookings found.
                </div>
              ) : (
                <>
                  {paginatedDrivers.map((driver) => (
                    <div
                      key={driver._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white/80 dark:bg-zinc-900/70 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-[1.025]"
                    >
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-300 font-semibold text-base">
                            {driver.drivername
                              ? driver.drivername
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "D"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-[#BAFB5D]">
                            <span className="font-medium">
                              {driver?.drivername
                                ? driver.drivername.charAt(0).toUpperCase() + driver.drivername.slice(1)
                                : "No driver assigned"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                            {driver.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right min-w-[120px] flex flex-col items-end sm:items-end sm:mt-0 mt-2">
                        <span
                          className={
                            "inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 " +
                            (driver.status === "Available"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : driver.status === "On Trip"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300")
                          }
                        >
                          {driver.status || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Earnings: <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {typeof driver?.totalEarnings !== "undefined" ? `$${driver?.totalEarnings}` : "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 sm:gap-0">
                    <Button
                      onClick={() =>
                        setDriverPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={driverPage === 1}
                      className="text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800 w-full sm:w-auto border border-gray-200 dark:border-zinc-700"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Page {driverPage} of {driverTotalPages}
                    </span>
                    <Button
                      onClick={() =>
                        setDriverPage((prev) =>
                          Math.min(prev + 1, driverTotalPages)
                        )
                      }
                      disabled={driverPage === driverTotalPages}
                      className="text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800 w-full sm:w-auto border border-gray-200 dark:border-zinc-700"
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </DashboardLayout>
  );
}
