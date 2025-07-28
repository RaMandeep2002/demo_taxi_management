"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../DashBoardLayout";
import { Button } from "@/components/ui/button";
import {
  Car,
  Clock,
  Clock10,
  Download,
  List,
  MapPin,
  MapPinCheck,
  Route,
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
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
          Booking History Reports
        </h1>

        {/* Filter & Download Form */}
        <form onSubmit={handleDownload} className="w-full mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Filter Bookings</CardTitle>
              <CardDescription>
                Search and filter booking history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="fromDate" className="text-sm font-medium text-gray-700">
                    From Date
                  </Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="px-2 py-2 text-black border rounded-md appearance-none 
                      dark:text-white
                      [&::-webkit-calendar-picker-indicator]:invert
                      dark:[&::-webkit-calendar-picker-indicator]:invert-0
                      [&::-webkit-calendar-picker-indicator]:bg-black
                      placeholder:text-zinc-400 dark:placeholder:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="toDate" className="text-sm font-medium text-gray-700">
                    To Date
                  </Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="px-2 py-2 text-black border rounded-md appearance-none 
                    dark:text-white
                    [&::-webkit-calendar-picker-indicator]:invert
                    dark:[&::-webkit-calendar-picker-indicator]:invert-0
                    [&::-webkit-calendar-picker-indicator]:bg-black
                    placeholder:text-zinc-400 dark:placeholder:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="pickup" className="text-sm font-medium text-gray-700">
                    Pickup Address
                  </Label>
                  <Input
                    id="pickup"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup Address"
                    className="px-2 py-2 text-black border rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="drivername" className="text-sm font-medium text-gray-700">
                    Driver Name
                  </Label>
                  <Input
                    id="drivername"
                    value={drivername}
                    onChange={(e) => setDrivername(e.target.value)}
                    placeholder="Driver Name"
                    className="px-2 py-2 text-black border rounded-md"
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
                <p className="text-red-500 text-sm mt-2">{iserror}</p>
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
        <div className="border rounded-xl overflow-auto shadow-lg">
          <Card>
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
                      <TableCell colSpan={9} className="text-center text-black dark:text-white">
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
