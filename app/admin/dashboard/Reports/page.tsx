"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../DashBoardLayout";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Car,
  Clock,
  Clock10,
  Download,
  List,
  MapPin,
  MapPinCheck,
  Route,
  // TrendingUp,
  // Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchBookingHistory } from "../../slices/slice/booingHistorySlice";
import { getBookingReport } from "../../slices/slice/getReportSlice";
import { useDebounce } from "@/lib/useDebounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


// const performanceMetrics = [
//   {
//     title: 'Total Revenue',
//     value: '$48,675',
//     change: '+18%',
//     trend: 'up',
//     period: 'vs last month'
//   },
//   {
//     title: 'Total Trips',
//     value: '2,847',
//     change: '+12%',
//     trend: 'up',
//     period: 'vs last month'
//   },
//   {
//     title: 'Average Trip Value',
//     value: '$17.10',
//     change: '+5%',
//     trend: 'up',
//     period: 'vs last month'
//   },
//   {
//     title: 'Customer Satisfaction',
//     value: '4.8/5',
//     change: '+0.2',
//     trend: 'up',
//     period: 'vs last month'
//   }
// ];

export default function Reports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pickup, setPickup] = useState("");
  const [drivername, setDrivername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const debouncedDriverSearch = useDebounce(drivername, 300);
  const debouncedPickupSearch = useDebounce(pickup, 300);

  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, error } = useSelector(
    (state: RootState) => state.fetchBookingHistory
  );
  const { isDownloading, iserror } = useSelector(
    (state: RootState) => state.getBookingReport
  );

  useEffect(() => {
    dispatch(fetchBookingHistory());
  }, [dispatch]);

  // Convert YYYY-MM-DD to MM/DD/YYYY for comparison
  const convertDateFormat = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };
  const formattedFromDate = convertDateFormat(fromDate);
  const formattedToDate = convertDateFormat(toDate);

  const filteredBookings =
    bookings?.filter((booking) => {
      const bookingDate = booking?.pickupDate;

      const isDriverMatch = debouncedDriverSearch
        ? booking.driver?.drivername
            ?.toLowerCase()
            .includes(debouncedDriverSearch.toLowerCase())
        : true;

      const isPickupMatch = debouncedPickupSearch
        ? booking.pickup?.address
            ?.toLowerCase()
            .includes(debouncedPickupSearch.toLowerCase())
        : true;

      const isFromDateMatch = fromDate
        ? bookingDate && formattedFromDate
          ? new Date(bookingDate as string) >= new Date(formattedFromDate)
          : false
        : true;

      const isToDateMatch = toDate
        ? bookingDate && formattedToDate
          ? new Date(bookingDate as string) <= new Date(formattedToDate)
          : false
        : true;

      return isDriverMatch && isPickupMatch && isFromDateMatch && isToDateMatch;
    }) || [];

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      getBookingReport({
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        pickup,
        drivername,
      })
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white tracking-wider">
              Booking History Reports
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300 tracking-wider">
              View, filter, and download detailed reports of all taxi bookings.
                Use the filters below to customize your report by date, driver, or
              pickup location.
            </p>
          </div>
        </div>
        {/* 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {performanceMetrics.map((metric, index) => (
            <Card
              key={index}
              className="shadow-lg border-0 bg-gradient-to-br dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition hover:scale-[1.05] w-full"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{metric.change}</span>
                  <span className="text-sm text-gray-500">{metric.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

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

        {/* Filter & Download Form */}
        <form onSubmit={handleDownload} className="w-full mb-8">
          <Card className="list-card">
            <CardHeader>
              <CardTitle>Filter Bookings</CardTitle>
              <CardDescription>
                Search and filter booking history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="toDate"
                    className="flex items-center text-sm font-medium"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    From Date
                  </Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="px-2 py-2 text-black border dark:border-white rounded-md appearance-none
                    dark:text-white
                    w-full min-w-0
                    sm:text-base text-sm
                    [&::-webkit-calendar-picker-indicator]:invert
                    dark:[&::-webkit-calendar-picker-indicator]:invert-0
                    [&::-webkit-calendar-picker-indicator]:bg-transparent
                    placeholder:text-zinc-400 dark:placeholder:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="toDate"
                    className="flex items-center text-sm font-medium"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    To Date
                  </Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="px-2 py-2 text-black border dark:border-white rounded-md appearance-none 
                    dark:text-white
                     w-full min-w-0
                    sm:text-base text-sm
                    [&::-webkit-calendar-picker-indicator]:invert
                    dark:[&::-webkit-calendar-picker-indicator]:invert-0
                    [&::-webkit-calendar-picker-indicator]:bg-transparent
                    placeholder:text-zinc-400 dark:placeholder:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="pickup" className="text-sm font-medium">
                    Pickup Address
                  </Label>
                  <Input
                    id="pickup"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup Address"
                    className="px-2 py-2 border dark:border-white rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="drivername" className="text-sm font-medium">
                    Driver Name
                  </Label>
                  <Input
                    id="drivername"
                    value={drivername}
                    onChange={(e) => setDrivername(e.target.value)}
                    placeholder="Driver Name"
                    className="px-2 py-2 border dark:border-white rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-1 justify-end">
                  <Button
                    type="submit"
                    className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 rounded-md"
                    disabled={isDownloading}
                  >
                    <Download size={16} />
                    {isDownloading ? "Downloading..." : "Download CSV"}
                  </Button>
                </div>
              </div>
              {iserror && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2">
                  <svg
                    className="w-4 h-4 text-red-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="text-red-600 text-sm font-medium">
                    {iserror}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-2 text-black border rounded-md appearance-none [&::-webkit-calendar-picker-indicator]:invert placeholder:text-zinc-400"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-2 text-black border rounded-md appearance-none [&::-webkit-calendar-picker-indicator]:invert placeholder:text-zinc-400"
            />
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup Address"
              className="px-2 py-2 text-black border rounded-md"
            />
            <input
              value={drivername}
              onChange={(e) => setDrivername(e.target.value)}
              placeholder="Driver Name"
              className="px-2 py-2 text-black border rounded-md"
            />
            <button
              type="submit"
              className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 rounded-md"
              disabled={isDownloading}
            >
              <Download size={16} />
              {isDownloading ? "Downloading..." : "Download CSV"}
            </button>
          </div>
          {iserror && <p className="text-red-500 text-sm mt-2">{iserror}</p>} */}
        </form>

        {/* Table */}
        <div>
          <Card className="list-card">
            {/* <CardHeader className="px-4 py-6 sm:px-6 bg-white border-b">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Bookings
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Detailed view of all booking records
                  </CardDescription>
                </div>
              </div>
            </CardHeader> */}

            <CardContent>
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* "Booking Date",
                  "Pickup Time",
                  "Drop-Off Time",
                  "Driver",
                  "Distance",
                  "Waiting Time",
                  "Total Fare",
                  "Pickup",
                  "Drop Off", */}
                      {/* <TableHead></TableHead> */}
                      <TableHead>Booking ID</TableHead>
                      <TableHead>PickUp Date & Time</TableHead>
                      <TableHead>DropOff Date & Time</TableHead>
                      <TableHead>Driver & Vehicle</TableHead>
                      <TableHead>Route - Pickup / Drop off</TableHead>
                      <TableHead>Distance & waiting Time</TableHead>
                      <TableHead>Total Fare</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          Loading...
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
                                {booking.driver?.drivername}
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
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {`${booking?.pickup?.address}`}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <MapPinCheck className="h-4 w-4" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-400">
                                  {booking.dropOff?.address ? (
                                    booking.dropOff?.address
                                  ) : (
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
                                  {`${booking.distance} Km`}
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
                                {booking.driver?.drivername
                                  ? booking.driver.drivername
                                      .charAt(0)
                                      .toUpperCase() +
                                    booking.driver.drivername.slice(1)
                                  : "No driver assigned"}
                              </span>

                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {`${booking?.pickup?.address}`} →{" "}
                                {booking.dropOff?.address
                                  ? `${booking.dropOff.address}`
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
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Pickup:
                                  </span>{" "}
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                      booking?.pickup?.address || ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-gray-900 dark:text-white"
                                    title="View on Google Maps"
                                  >
                                    {`${booking?.pickup?.address}`}
                                  </a>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPinCheck className="h-4 w-4 text-green-400" />
                                <span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Dropoff:
                                  </span>{" "}
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
                                      {`${booking.dropOff?.address}`}
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
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Vehicle:
                                  </span>{" "}
                                  {booking?.vehicle?.vehicleModel || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Driver:
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-200">
                                  {booking.driver?.drivername
                                    ? booking.driver.drivername
                                        .charAt(0)
                                        .toUpperCase() +
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
                                    {booking.distance}{" "}
                                    <span className="text-xs font-medium text-gray-500">
                                      Km
                                    </span>
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
                                    {booking.wating_time_formated &&
                                    booking.wating_time_formated !== "0" ? (
                                      booking.wating_time_formated
                                    ) : (
                                      <span className="italic text-gray-400">
                                        0
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm w-full sm:w-auto">
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Status:
                                </span>
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
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Fare:
                                </span>
                                <span className="font-bold text-zinc-900 dark:text-[#BAFB5D]">
                                  ${booking.totalFare}
                                </span>
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
          {/* <Table>
            <TableHeader>
              <TableRow className=" border-b border-[#F5EF1B] text-[#F5EF1B] text-base">
                {[
                  "Booking Date",
                  "Pickup Time",
                  "Drop-Off Time",
                  "Driver",
                  "Distance",
                  "Waiting Time",
                  "Total Fare",
                  "Pickup",
                  "Drop Off",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="min-w-[120px] h-[50px] text-[#F5EF1B]"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-white"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-white"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedBookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-white"
                  >
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBookings.map((booking) => (
                  <TableRow
                    key={booking.bookingId}
                    className="border-b border-[#F5EF1B]"
                  >
                    <TableCell className="text-white">
                      {booking.pickupDate}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.pickuptime}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.dropdownTime}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.driver?.drivername || "No driver assigned"}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.distance}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.wating_time_formated
                        ? booking.wating_time_formated
                        : "00:00:00"}
                    </TableCell>
                    <TableCell className="text-white">
                      {(() => {
                        const fare = booking?.totalFare;
                        const fareStr = `$${fare}`;
                        const decimalPart = fare?.toString().split(".")[1];
                        if (decimalPart && decimalPart.length === 1) {
                          return fareStr + "0";
                        }
                        return fareStr;
                      })()}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.pickup?.address}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.dropOff?.address ? (
                        `${booking.dropOff.address}`
                      ) : (
                        <span className="text-gray-400 italic">
                          No address provided
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table> */}
        </div>

        {/* Pagination */}
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
