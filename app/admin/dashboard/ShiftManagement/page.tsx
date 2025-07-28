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
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Shift Management</h1>
            <p>Monitor and manage driver shifts and schedules</p>
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

        <div className="rounded-lg overflow-hidden">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>All Drivers</CardTitle>
                  <CardDescription>
                    Complete list of registered drivers
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
