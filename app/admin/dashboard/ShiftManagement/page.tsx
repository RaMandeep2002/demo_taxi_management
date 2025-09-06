"use client";
import { Input } from "@/components/ui/input";
import DashboardLayout from "../../DashBoardLayout";
import { Button } from "@/components/ui/button";
// import { Search } from "lucide-react";
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
import { fetchShiftsWithVehicles } from "../../slices/slice/shiftandvehicleSlice";
import { useEffect, useState, useRef } from "react";
import {
  resetShiftActionState,
  stopShiftByAdmin,
} from "../../slices/slice/stopShiftsDriver";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/lib/useDebounce";
import { Ban, Car, Clock10, Plus, Search } from "lucide-react";
import { stopAllShiftByAdmin } from "../../slices/slice/stopAllShiftSlice";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Label } from "@/components/ui/label";


export default function ShiftsAndVehicle() {
  const { toast: showToast } = useToast(); // rename to avoid shadowing
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [stoppingDriverId, setStoppingDriverId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const hasHandledToast = useRef(false); // prevent infinite re-renders

  const { shifts, loading, error } = useSelector(
    (state: RootState) => state.shiftsWithVehicle
  );
  const {
    success,
    iserror: stopError,
    message,
    shiftDuration,
  } = useSelector((state: RootState) => state.shiftActions);
  const { ismessage, stoppedShifts } = useSelector(
    (state: RootState) => state.stopAllShift
  );

  useEffect(() => {
    dispatch(fetchShiftsWithVehicles());
  }, [dispatch]);

  const filteredShifts =
    shifts?.filter((shift) =>
      shift.driver.drivername
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    if ((success || stopError) && !hasHandledToast.current) {
      hasHandledToast.current = true;

      if (success) {
        showToast({
          title: message || "Shift stopped successfully!",
          description: shiftDuration ? `Duration: ${shiftDuration}` : "",
        });
        dispatch(fetchShiftsWithVehicles());
        dispatch(resetShiftActionState());
        setStoppingDriverId(null);
      } else if (stopError) {
        showToast({
          title: "Error stopping shift",
          description: `Failed to stop the shift: ${stopError}`,
        });
        setStoppingDriverId(null);
      }

      // Allow toasts again after short delay
      setTimeout(() => {
        hasHandledToast.current = false;
      }, 1000);
    }
  }, [success, stopError, message, shiftDuration, dispatch, showToast]);

  const handleStopShiftDriver = (driverId: string) => async () => {
    setStoppingDriverId(driverId);

    const now = new Date();
    const endDate = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    const endTime = now
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
      .replace(/\s?([AP]M)$/i, (match, p1) => p1.toLowerCase());

    try {
      await dispatch(
        stopShiftByAdmin({
          driverId,
          endTime,
          endDate,
        })
      );
    } catch (err) {
      showToast({
        title: "Error",
        description: `Failed to stop shift: ${err}`,
        variant: "destructive",
      });
      setStoppingDriverId(null);
    }
  };

  const handleStopAllShiftDriver = async () => {
    const now = new Date();
    const endDate = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    const endTime = now
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
      .replace(/\s?([AP]M)$/i, (match, p1) => p1.toLowerCase());

    try {
      await dispatch(
        stopAllShiftByAdmin({
          endTime,
          endDate,
        })
      );
      showToast({
        title: ismessage || "All Shift stopped successfully!",
        description: stoppedShifts ? `No of Shifts : ${stoppedShifts}` : "",
      });
      dispatch(fetchShiftsWithVehicles());
    } catch (err) {
      showToast({
        title: "Error",
        description: `Failed to stop shift: ${err}`,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 dark:text-blue-200 tracking-tight">
              Shift Management
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium">
              Monitor and manage driver shifts and schedules
            </p>
            <div className="h-1 w-20 bg-blue-500 rounded mt-2" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-0">
            <Button
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow"
              onClick={() => {
                router.push("/admin/dashboard/ScheduleRide/");
              }}
            >
              <span className="animate-pulse">
                <Plus size={20} />
              </span>
              Schedule Shift
            </Button>
            <Button
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 shadow"
              onClick={handleStopAllShiftDriver}
            >
              <span className="animate-pulse">
                <Ban className="mr-2 h-4 w-4" />
              </span>
              Stop All Shift
            </Button>
          </div>
        </div>

        {/* <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
            <Input
              autoFocus
              placeholder="Search by driver name..."
              className="w-full sm:w-72 text-white border border-[#F5EF1B] placeholder-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            <Button
              className="w-full sm:w-auto text-white bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              onClick={handleStopAllShiftDriver}
            >
              <span className="animate-pulse">
                <Ban className="mr-2 h-4 w-4" />
              </span>
              Stop All Shift
            </Button>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Active Shifts Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-green-500/10 rounded-full p-2">
                <Clock10 className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-200">
                Total Shifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-900 dark:text-green-200">
                {filteredShifts.length}
              </div>
              <p className="text-xs text-green-600 mt-1 font-medium">
                {Number(filteredShifts.length) > 0
                  ? `${filteredShifts.length} Shfits`
                  : "No active shifts"}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-green-500/10 rounded-full p-2">
                <Clock10 className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-200">
                Active Shifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-900 dark:text-green-200">
              {filteredShifts.filter(shift => shift.isActive === true).length}
              </div>
              <p className="text-xs text-green-600 mt-1 font-medium">
              {filteredShifts.filter(shift => shift.isActive === true).length} Active
              </p>
            </CardContent>
          </Card> 

          {/* Scheduled Shifts Card */}
          {/* <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-blue-500/10 rounded-full p-2">
                <Plus className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-200">
                {shiftStats[1].value}
              </div>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                {Number(shiftStats[1].value) > 0
                  ? `${shiftStats[1].change} today`
                  : "No scheduled shifts"}
              </p>
            </CardContent>
          </Card> */}

          {/* On Break Card */}
          {/* <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-yellow-500/10 rounded-full p-2">
                <Clock10 className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <CardTitle className="text-sm font-semibold text-yellow-700 dark:text-yellow-200">
                On Break
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-900 dark:text-yellow-200">
                {shiftStats[2].value}
              </div>
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                {Number(shiftStats[2].value) > 0
                  ? `${shiftStats[2].change} today`
                  : "No drivers on break"}
              </p>
            </CardContent>
          </Card> */}

          {/* Completed Shifts Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-gray-500/10 rounded-full p-2">
                <Car className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
              {filteredShifts.filter(shift => shift.isActive === false).length}
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium">
              {filteredShifts.filter(shift => shift.isActive === false).length} Completed
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
        <Card className="list-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>All Shifts</CardTitle>
                  <CardDescription>
                    Overview of all driver shifts and their statuses
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search drivers..."
                      className="pl-10 w-64"
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
                    <TableHead>Driver Name</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Shift Status</TableHead>
                    <TableHead>Shift Earnings</TableHead>
                    <TableHead>Vehicle Status</TableHead>
                    <TableHead>Action</TableHead>
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
                  ) : paginatedShifts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        No Shifts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedShifts.map((shift, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-base">
                                {shift.driver.drivername
                                  ? shift.driver.drivername
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "D"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {highlightMatch(
                                  shift.driver.drivername,
                                  debouncedSearch
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {shift.driver.driverId?.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Car className="h-3 w-3 text-gray-400 dark:text-white" />
                              <span className="text-gray-600 dark:text-white">
                                {shift.vehicle.vehicleModel}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock10 className="h-3 w-3 text-gray-400 dark:text-white" />
                              <span className="text-gray-600 dark:text-white">
                                {`${shift.startTime} - ${shift.startDate}`}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock10 className="h-3 w-3 text-gray-400 dark:text-white" />
                              <span className="text-gray-600 dark:text-white">
                                {shift.endTime && shift.endDate
                                  ? `${shift.endTime} - ${shift.endDate}`
                                  : "Ongoing"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={shift.isActive ? "default" : "outline"}
                          >
                            {shift.isActive ? "Active" : "End"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              {/* <DollarSign className="h-3 w-3 text-gray-400 dark:text-white" /> */}
                              <span className="font-medium text-green-600 dark:text-yellow-300">
                                ${shift.totalEarnings}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                              shift.isActive
                                ? shift.vehicle.isAssigned
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                                : shift.vehicle.isAssigned
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                          >
                            {shift.isActive
                              ? shift.vehicle.isAssigned
                                ? "Assigned"
                                : "Free"
                              : shift.vehicle.isAssigned
                              ? "Free"
                              : "Free"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            disabled={
                              !shift.isActive ||
                              stoppingDriverId === shift.driver.driverId
                            }
                            onClick={handleStopShiftDriver(
                              shift.driver.driverId
                            )}
                            className="hover:cursor-pointer"
                          >
                            Stop Shift
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="block sm:hidden">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : paginatedShifts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No Shifts found</div>
            ) : (
              <Accordion type="single" collapsible>
                {paginatedShifts.map((shift, index) => (
                  <AccordionItem key={index} value={String(index)}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-base">
                            {shift.driver.drivername
                              ? shift.driver.drivername
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "D"}
                          </span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-gray-900 dark:text-gray-200 truncate">
                            {shift.driver.drivername}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {shift.vehicle.vehicleModel}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 mr-2 rounded-full font-semibold text-xs ${
                            shift.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {shift.isActive ? "Active" : "Completed"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-2 py-3 space-y-2">
                        <div>
                          <span className="block text-xs text-gray-400">Vehicle</span>
                          <span className="font-medium">{shift.vehicle.vehicleModel}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-400">Start</span>
                          <span className="font-medium">{shift.startTime}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-400">End</span>
                          <span className="font-medium">{shift.endTime || "Ongoing"}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-400">Shift Earnings</span>
                          <span className="font-medium text-green-600 dark:text-yellow-300">
                            ${shift.totalEarnings}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-400">Vehicle Status</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              shift.isActive
                                ? shift.vehicle.isAssigned
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                : shift.vehicle.isAssigned
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {shift.isActive
                              ? shift.vehicle.isAssigned
                                ? "Assigned"
                                : "Free"
                              : shift.vehicle.isAssigned
                              ? "Free"
                              : "Free"}
                          </span>
                        </div>
                        <div>
                          <Button
                            size="sm"
                            disabled={
                              !shift.isActive ||
                              stoppingDriverId === shift.driver.driverId
                            }
                            onClick={handleStopShiftDriver(
                              shift.driver.driverId
                            )}
                            className="hover:cursor-pointer mt-2"
                          >
                            Stop Shift
                          </Button>
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
  const regex = new RegExp(`(${term})`, "gi");
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text.replace(regex, `<mark class="bg-yellow-300">$1</mark>`),
      }}
    />
  );
};
