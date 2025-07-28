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
          .includes(debouncedSearch.toLowerCase());

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
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking History</h1>
          <p className="mt-1">Complete record of all taxi bookings and rides</p>
        </div>

        <div className="rounded-lg overflow-hidden">
          <Card>
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
                        className="w-full sm:w-auto font-semibold rounded-lg border-gray-300 transition"
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
                          className="font-medium px-3 py-2 text-sm cursor-pointer  transition"
                        >
                          {status}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
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
                        No Shifts found
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
                            <p className="font-medium text-gray-900 dark:text-white">{booking.bookingId}</p>
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
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {highlightMatch(
                                  `${booking?.pickup?.address}`,
                                  debouncedSearch
                                )}
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
                                {booking.distance}
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
                            <div className="text-sm font-medium">
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
