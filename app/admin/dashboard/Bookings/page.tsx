"use client";
import DashboardLayout from "../../DashBoardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Car,
  ChevronDown,
  Clock,
  Clock10,
  List,
  MapPin,
  MapPinCheck,
  Route,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import { fetchBookingHistory } from "@/app/admin/slices/slice/booingHistorySlice";
import { useDebounce } from "@/lib/useDebounce";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Badge } from "@/components/ui/badge";

// import ServerTime from "@/app/components/LocalTime";
// import ServerTime from "@/app/components/LocalTime";

export default function BookingHistory() {
  const dispatch = useDispatch<AppDispatch>();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const itemsPerPage = 15;

  const [filterStatus, setFilterStatus] = useState("All");

  const {
    bookings: bookings,
    loading,
    error,
  } = useSelector((state: RootState) => state.fetchBookingHistory);
  useEffect(() => {
    dispatch(fetchBookingHistory());
  }, [dispatch]);

  const matchesStatus = [
    "All",
    ...new Set(bookings.map((b) => b.driver?.drivername || "No driver assign")),
  ];

  const filteredBookings =
    bookings?.filter((booking) => {
      const matchesSearch =
        booking.driver?.drivername
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        booking?.pickup?.address
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
          booking?.dropOff?.address?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesFilterStatus =
        filterStatus === "All" || booking.driver?.drivername === filterStatus;

      return matchesSearch && matchesFilterStatus;
    }) || [];

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-200 tracking-tight">
                Booking History
              </h1>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Complete record of all taxi bookings and rides
              </p>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded mt-4 shadow-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Bookings Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-blue-500/10 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                </svg>
              </div>
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-200">
                {bookings.length}
              </div>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                {bookings.length > 0
                  ? `+${Math.floor(bookings.length * 0.12)} this month`
                  : "No new bookings"}
              </p>
            </CardContent>
          </Card>

          {/* Completed Bookings Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-green-500/10 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-200">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-900 dark:text-green-200">
                {
                  bookings.filter((booking) => booking.status === "completed")
                    .length
                }
              </div>
              <p className="text-xs text-green-600 mt-1 font-medium">
                {bookings.length > 0
                  ? `${Math.round(
                      (bookings.filter(
                        (booking) => booking.status === "completed"
                      ).length /
                        bookings.length) *
                        100
                    )}% of total`
                  : "No completed bookings"}
              </p>
            </CardContent>
          </Card>

          {/* Total Earnings Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-yellow-500/10 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" />
                </svg>
              </div>
              <CardTitle className="text-sm font-semibold text-yellow-700 dark:text-yellow-200">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-900 dark:text-yellow-200">
                $
                {bookings
                  .reduce((acc, booking) => acc + (booking.totalFare || 0), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                {bookings.length > 0 ? "+18% this month" : "No earnings yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="list-card">
            <CardHeader className="px-4 py-6 sm:px-6 border-b">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Section - Title and Description */}
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-semibold">
                    Recent Bookings
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Detailed view of all booking records
                  </CardDescription>
                </div>

                {/* Right Section - Search and Filter */}
                <div className="w-full sm:w-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    <Input
                      placeholder="Search by Driver Name, Pickup..."
                      className="pl-10 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Dropdown Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent font-semibold rounded-lg border-gray-300 transition"
                      >
                        {filterStatus === "All" ? "Drivers" : filterStatus}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="shadow-lg min-w-[150px] rounded-md border"
                    >
                      {matchesStatus.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={filterStatus === status}
                          onCheckedChange={() => setFilterStatus(status)}
                          className={`
                            font-medium text-sm cursor-pointer transition
                            flex gap-2
                          `}
                        >
                          <span className="flex-1">{status}</span>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead></TableHead> */}
                      <TableHead>Booking ID</TableHead>
                      <TableHead>PickUp Date & Time</TableHead>
                      <TableHead>DropOff Date & Time</TableHead>
                      <TableHead>Driver & Vehicle</TableHead>
                      <TableHead>Route - Pickup / Drop off</TableHead>
                      <TableHead>Distance & waiting Time</TableHead>
                      <TableHead>Fare</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-8 w-8 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
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
                            <span className="text-blue-700 dark:text-blue-300 font-medium text-base">
                              Loading bookings...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-black dark:text-white"
                        >
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : paginatedBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No Bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-base">
                                  <List />
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {booking.bookingId}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {booking.pickupDate}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.pickuptime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {booking.dropdownDate}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.dropdownTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {highlightMatch(
                                  !booking.driver?.drivername
                                    ? "No driver assign"
                                    : booking.driver?.drivername,
                                  debouncedSearch
                                )}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Car className="h-3 w-3" />
                                {booking?.vehicle?.company}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <MapPin className="h-4 w-4" />
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    booking?.pickup?.address || ""
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold text-gray-900 dark:text-white"
                                  title="View on Google Maps"
                                >
                                  {highlightMatch(
                                    `${booking?.pickup?.address}`,
                                    debouncedSearch
                                  )}
                                </a>
                                {/* <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {highlightMatch(
                                  `${booking?.pickup?.address}`,
                                  debouncedSearch
                                )}
                              </span> */}
                              </div>
                              <div className="flex gap-2">
                                <MapPinCheck className="h-4 w-4" />
                                <span className="text-xs font-light text-gray-700 dark:text-gray-400">
                                  {booking.dropOff?.address ? (
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        booking?.dropOff?.address || ""
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-semibold"
                                      title="View on Google Maps"
                                    >
                                      {highlightMatch(
                                        `${booking.dropOff?.address}`,
                                        debouncedSearch
                                      )}
                                    </a>
                                  ) : (
                                    // booking.dropOff?.address
                                    <span className="italic text-gray-400">
                                      On The Way
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Route className="h-4 w-4" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {booking.distance} Km
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Clock10 className="h-4 w-4" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-400">
                                  {booking.wating_time_formated || (
                                    <span className="italic text-gray-400">
                                      0
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-green-600 dark:text-yellow-300">
                                ${booking?.totalFare}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "accepted"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : booking.status === "ongoing"
                                      ? "bg-blue-100 text-blue-800"
                                      : booking.status === "pending"
                                      ? "bg-gray-100 text-gray-800"
                                      : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="block sm:hidden">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                    <span className="text-blue-700 dark:text-blue-300 font-medium text-base">
                      Loading bookings...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">{error}</div>
                ) : paginatedBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No Bookings found
                  </div>
                ) : (
                  <Accordion type="single" collapsible>
                    {paginatedBookings.map((booking) => (
                      <AccordionItem
                        key={booking.bookingId}
                        value={booking.bookingId}
                      >
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-base sm:text-base text-zinc-900 dark:text-[#BAFB5D]">
                                #{booking.bookingId}
                              </span>

                              <span>
                                {highlightMatch(
                                  booking.driver?.drivername
                                    ? booking.driver.drivername
                                        .charAt(0)
                                        .toUpperCase() +
                                        booking.driver.drivername.slice(1)
                                    : "No driver assigned",
                                  debouncedSearch
                                )}
                              </span>

                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {highlightMatch(
                                  `${booking?.pickup?.address}`,
                                  debouncedSearch
                                )}{" "}
                                →{" "}
                                {booking.dropOff?.address
                                  ? highlightMatch(
                                      `${booking.dropOff.address}`,
                                      debouncedSearch
                                    )
                                  : "Ongoing"}
                              </p>
                            </div>
                            {/* <div className="flex flex-col">
                              <span className="font-medium text-gray-900 dark:text-gray-200">
                                {highlightMatch(
                                  booking.driver?.drivername
                                    ? booking.driver.drivername.charAt(0).toUpperCase() +
                                      booking.driver.drivername.slice(1)
                                    : "No driver assigned",
                                  debouncedSearch
                                )}
                              </span>
                              <span className="text-xs text-gray-500">
                                {booking?.pickup?.address
                                  ? `${booking.pickup.address.slice(0, 4)}...${booking.pickup.address.slice(-4)}`
                                  : ""}
                              </span>
                            </div> */}
                          </div>
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                            <div className="font-medium text-gray-900 dark:text-gray-200 text-right sm:text-left text-base">
                              ${booking.totalFare}
                            </div>
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full font-semibold text-xs ${
                                  booking.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {booking.status || "pending"}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-400" />
                                <span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pickup:</span>{" "}
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                      booking?.pickup?.address || ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-gray-900 dark:text-white"
                                    title="View on Google Maps"
                                  >
                                    {highlightMatch(
                                      `${booking?.pickup?.address}`,
                                      debouncedSearch
                                    )}
                                  </a>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPinCheck className="h-4 w-4 text-green-400" />
                                <span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dropoff:</span>{" "}
                                  {booking.dropOff?.address ? (
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        booking?.dropOff?.address || ""
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-semibold"
                                      title="View on Google Maps"
                                    >
                                      {highlightMatch(
                                        `${booking.dropOff?.address}`,
                                        debouncedSearch
                                      )}
                                    </a>
                                  ) : (
                                    <span className="italic text-gray-400">
                                      On The Way
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Pickup Date:
                                  </span>{" "}
                                  {booking?.pickupDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock10 className="h-4 w-4 text-gray-400" />
                                <span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Pickup Time:
                                  </span>{" "}
                                  {booking?.pickuptime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-blue-400" />
                                <span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vehicle:</span>{" "}
                                  {booking?.vehicle?.vehicleModel || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Driver:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-200">
                                  {booking.driver?.drivername
                                    ? booking.driver.drivername.charAt(0).toUpperCase() +
                                      booking.driver.drivername.slice(1)
                                    : "No driver assigned"}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-3">
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm w-full sm:w-auto">
                                <Route className="h-5 w-5 text-blue-500" />
                                <div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Distance
                                  </div>
                                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                                    {booking.distance} <span className="text-xs font-medium text-gray-500">Km</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm w-full sm:w-auto">
                                <Clock10 className="h-5 w-5 text-yellow-500" />
                                <div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Waiting Time
                                  </div>
                                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                                    {booking.wating_time_formated && booking.wating_time_formated !== "0"
                                      ? booking.wating_time_formated
                                      : <span className="italic text-gray-400">0</span>
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm w-full sm:w-auto">
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status:</span>
                                <span
                                  className={`px-2 py-1 rounded-full font-semibold text-xs ${
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : booking.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {booking.status || "pending"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm w-full sm:w-auto">
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fare:</span>
                                <span className="font-bold text-zinc-900 dark:text-[#BAFB5D]">${booking.totalFare}</span>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 sm:gap-0">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="text-black bg-white hover:bg-gray-100 hover:text-black w-full sm:w-auto border border-gray-300"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="text-black bg-white hover:bg-gray-100 hover:text-black w-full sm:w-auto border border-gray-300"
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

const highlightMatch = (text: string, term: string) => {
  if (!text) return text;
  const regex = new RegExp(`(${term})`, "gi");
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text.replace(regex, `<mark class="bg-gray-300">$1</mark>`),
      }}
    />
  );
};
