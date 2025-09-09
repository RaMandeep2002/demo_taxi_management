"use client";
import {
  List,
  Search,
  Clock,
  MapPin,
  MapPinCheck,
  Calendar,
  Plus,
  ArrowRight,
} from "lucide-react";
import DashboardLayout from "../../DashBoardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import { useSelector } from "react-redux";
import { fetchScheduleHistory } from "../../slices/slice/getScheduleRideSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function ScheduleRideList() {
  // For demo, debouncedSearch is empty string
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 800);
  const itemsPerPage = 15;

  const { data, loading, error } = useSelector(
    (state: RootState) => state.fetchScheduleHistory
  );

  useEffect(() => {
    dispatch(fetchScheduleHistory());
  }, [dispatch]);

  const filteredScheduleHistory = data?.filter((scheduleData) => {
    const matchesSearch =
      scheduleData?.customerName
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      scheduleData?.pickupAddress
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedScheduleData = filteredScheduleHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <DashboardLayout>
      <div className="w-full px-4 pt-4 sm:px-8 lg:px-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-black dark:text-[#BAFB5D]">
              <span>
                <List />
              </span>
              <span>Schedule Rides</span>
            </h1>
            <p className="mt-1">Create a new ride booking for customers</p>
          </div>
          <Button
             className="mt-4 sm:mt-0 px-7 py-4 font-extrabold text-lg bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white dark:bg-gradient-to-r dark:from-[#BAFB5D] dark:via-[#d6ff7f] dark:to-[#BAFB5D] dark:text-black rounded-full transition-all duration-200 shadow-lg tracking-wider flex items-center gap-3 hover:scale-105 hover:shadow-xl hover:bg-gray-900 dark:hover:bg-[#eaffb0] focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => {
              router.push("/admin/dashboard/ScheduleRide/");
            }}
          >
            <Plus size={20} />
            Schedule Ride
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden mt-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition">
          <CardHeader className="px-4 py-6 sm:px-6 border-b">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left Section - Title and Description */}
              <div>
                <CardTitle className="text-xl sm:text-2xl font-semibold">
                  Scheduled Ride List
                </CardTitle>
                <CardDescription className="text-sm">
                  View and manage all scheduled ride bookings for your
                  customers.
                </CardDescription>
              </div>

              {/* Right Section - Search and Filter */}
              <div className="w-full sm:w-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  <Input
                    placeholder="Search by Customer Name, Pickup..."
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
           <div className="hidden sm:block">
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Customer Name & Email</TableHead>
                  <TableHead>PickUp Date & Time</TableHead>
                  <TableHead>Route - Pickup / Drop off</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Round Trip</TableHead>
                  <TableHead>Send To Email</TableHead>
                  <TableHead>Return Date & Time</TableHead>
                  {/* <TableHead>Route - Pickup / Drop off</TableHead> */}
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
                ) : paginatedScheduleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No Bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedScheduleData.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-base">
                              <List />
                            </span>
                          </div>
                          {/* <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking._id.slice(0, 8)}...
                          </p>
                        </div> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {/* {booking.customerName} */}
                            {highlightMatch(
                              `${booking?.customerName}`,
                              debouncedSearch
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.customer_email}
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
                      {/* <TableCell>
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
                    </TableCell> */}
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <MapPin className="h-4 w-4" />
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                booking?.pickupAddress || ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-gray-900 dark:text-white"
                              title="View on Google Maps"
                            >
                              {highlightMatch(
                                `${booking?.pickupAddress}`,
                                debouncedSearch
                              )}
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <MapPinCheck className="h-4 w-4" />
                            <span className="text-xs font-light text-gray-700 dark:text-gray-400">
                              {booking.dropOffAddress ? (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    booking?.dropOffAddress || ""
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold"
                                  title="View on Google Maps"
                                >
                                 {booking.dropOffAddress}
                                </a>
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
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                booking.status === "schedule"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "Pickup"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {booking.status ? "Schedule" : "Pickup"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-medium">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                                booking.roundTrip === true
                                  ? "bg-green-100 text-green-800"
                                  : booking.roundTrip === false
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                              style={{
                                display: "inline-block",
                                minWidth: "70px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {booking.roundTrip ? (
                                <span>
                                  <span className="hidden xs:inline">
                                    Round Trip
                                  </span>
                                  <span className="inline xs:hidden">Yes</span>
                                </span>
                              ) : (
                                <span>
                                  <span className="hidden xs:inline">
                                    No Round
                                  </span>
                                  <span className="inline xs:hidden">No</span>
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-medium">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                                booking.sendtoemail === true
                                  ? "bg-green-100 text-green-800"
                                  : booking.sendtoemail === false
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                              style={{
                                display: "inline-block",
                                minWidth: "70px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {booking.sendtoemail ? (
                                <span>
                                  <span className="hidden xs:inline">
                                   Send
                                  </span>
                                  <span className="inline xs:hidden">Yes</span>
                                </span>
                              ) : (
                                <span>
                                  <span className="hidden xs:inline">
                                   Not
                                  </span>
                                  <span className="inline xs:hidden">No</span>
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {booking.returnDate ? (
                              booking.returnDate
                            ) : (
                              <span className="italic text-gray-400">N/A</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.returnTime ? (
                              booking.returnTime
                            ) : (
                              <span className="italic text-gray-400">N/A</span>
                            )}
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
              <div className="text-center py-8">
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
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : paginatedScheduleData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No Bookings found
              </div>
            ) : (
              <div>
                <Accordion type="single" collapsible>
                  {paginatedScheduleData.map((booking) => (
                    <AccordionItem key={booking._id} value={booking._id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 font-semibold text-base">
                              {booking.customerName
                                ? booking.customerName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "C"}
                            </span>
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium text-gray-900 dark:text-gray-200 truncate">
                              {highlightMatch(
                                booking.customerName,
                                searchTerm
                              )}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                            {booking.customer_email}
                            </span>
                          </div>
                          <div>
                          <span
                              className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                                booking.sendtoemail === true
                                  ? "bg-green-100 text-green-800"
                                  : booking.sendtoemail === false
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                              style={{
                                display: "inline-block",
                                minWidth: "70px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {booking.sendtoemail ? (
                                <span>
                                  <span className="hidden xs:inline">
                                   Send
                                  </span>
                                  <span className="inline xs:hidden">Yes</span>
                                </span>
                              ) : (
                                <span>
                                  <span className="hidden xs:inline">
                                   Not
                                  </span>
                                  <span className="inline xs:hidden">No</span>
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 space-y-2">
                          <div>
                            <span className="font-semibold">Pickup Date & Time: </span>
                            <span>
                              <Calendar className="inline h-4 w-4 mr-1" />
                              {booking.pickupDate || <span className="italic text-gray-400">N/A</span>}
                              {" "}
                              <Clock className="inline h-4 w-4 ml-2 mr-1" />
                              {booking.pickuptime
                               || <span className="italic text-gray-400">N/A</span>}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Route: </span>
                            <span>
                              <MapPin className="inline h-4 w-4 mr-1" />
                              {booking.pickupAddress || <span className="italic text-gray-400">N/A</span>}
                              {" "}
                              <ArrowRight className="inline h-4 w-4 mx-1" />
                              {booking.dropOffAddress || <span className="italic text-gray-400">N/A</span>}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Round Trip: </span>
                            <span>
                              {booking.roundTrip ? (
                                <Badge variant="default">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Send To Email: </span>
                            <span>
                              {booking.sendtoemail ? (
                                <Badge variant="default">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Return Date & Time: </span>
                            <span>
                              <Calendar className="inline h-4 w-4 mr-1" />
                              {booking.returnDate || <span className="italic text-gray-400">N/A</span>}
                              {" "}
                              <Clock className="inline h-4 w-4 ml-2 mr-1" />
                              {booking.returnTime || <span className="italic text-gray-400">N/A</span>}
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
           </div>
          </CardContent>
        </Card>
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
        __html: text.replace(
          regex,
          `<mark class="rounded-md bg-gray-300 dark:bg-[#23272e] dark:text-[#BAFB5D] font-semibold">$1</mark>`
        ),
      }}
    />
  );
};
