"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pencil,
  Eye,
  Plus,
  List,
  Search,
  MoreHorizontal,
  Trash,
  Car,
  Wrench,
  IdCardIcon,
  CalendarIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { fetchDetailWithVehicle } from "@/app/admin/slices/slice/detailWithVechicle";
import { AppDispatch, RootState } from "@/app/store/store";
import DashboardLayout from "@/app/admin/DashBoardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { updateVehicle } from "../../slices/slice/updateVehicleSlice";
import { Vehicle } from "@/app/types/DriverVechicleData";
import { useToast } from "@/hooks/use-toast";
import { deleteVehicle } from "../../slices/slice/deleteVehicleSlice";
import { useDebounce } from "@/lib/useDebounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function VechicleList() {
  // const [company, setCompany] = useState<string | "">("");
  // const [vehiclemodel, setVehiclemodel] = useState<string | "">("");
  // const [year, setYear] = useState<number | "">("");
  // const [vehicle_plate_number, setVehicle_plate_number] = useState<string | "">(
  //   ""
  // );
  const [dialogType, setDialogType] = useState<
    "view" | "edit" | "delete" | null
  >(null);

  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: Vehicles,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.detailWithVehicle);

  const { iserror } = useSelector((state: RootState) => state.updateVehcile);
  const { isDeleteting, succeesMessage } = useSelector(
    (state: RootState) => state.deleteVehicle
  );
  // const getsuccessmessage = vehicleinfo.message;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedsearch = useDebounce(searchTerm, 300);

  const itemsPerPage = 10;

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDialogOpen = (
    vehicle: Vehicle,
    type: "view" | "edit" | "delete"
  ) => {
    setSelectedVehicle(vehicle);
    setDialogType(type);
  };

  const handleDialogClose = () => {
    setSelectedVehicle(null);
    setDialogType(null);
  };

  // const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    dispatch(fetchDetailWithVehicle());
  }, [dispatch]);
  const [formData, setFormData] = useState({
    company: selectedVehicle?.company || "",
    vehicleModel: selectedVehicle?.vehicleModel || "",
    year: selectedVehicle?.year || 0,
    vehicle_plate_number: selectedVehicle?.vehicle_plate_number || "",
    vin_number: selectedVehicle?.vin_number || "",
    color: selectedVehicle?.color || "",
    fuel_type: selectedVehicle?.fuel_type || "",
    transmission: selectedVehicle?.transmission || "",
    registrationNumber: selectedVehicle?.registrationNumber || "",
    registration_State: selectedVehicle?.registration_State || "",
    registration_Expiry_Date: selectedVehicle?.registration_Expiry_Date || "",
    last_Inspection_Date: selectedVehicle?.last_Inspection_Date || "",
  });
  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        company: selectedVehicle.company || "",
        vehicleModel: selectedVehicle.vehicleModel || "",
        year: selectedVehicle.year || 0,
        vehicle_plate_number: selectedVehicle.vehicle_plate_number || "",
        vin_number: selectedVehicle.vin_number || "",
        color: selectedVehicle.color || "",
        fuel_type: selectedVehicle.fuel_type || "",
        transmission: selectedVehicle.transmission || "",
        registrationNumber: selectedVehicle.registrationNumber || "",
        registration_State: selectedVehicle.registration_State || "",
        registration_Expiry_Date:
          selectedVehicle.registration_Expiry_Date || "",
        last_Inspection_Date: selectedVehicle.last_Inspection_Date || "",
      });
    }
  }, [selectedVehicle]);

  const formattedVehicles = Vehicles?.filter((vehicle) => {
    const matchesSearch = vehicle.company
      .toLowerCase()
      .includes(debouncedsearch.toLowerCase());

    // const matchesStatus =
    //   filterStatus === "All" ||
    //   driver.vehicle.some((vehicle) => vehicle.status === filterStatus);

    // return matchesSearch && matchesStatus;
    return matchesSearch;
  });

  const totalPages = Math.ceil(Vehicles.length / itemsPerPage);

  const paginatedVehicles = formattedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(
        updateVehicle({
          registrationNumber: selectedVehicle!.registrationNumber,
          vehicleData: {
            company: formData.company,
            vehicleModel: formData.vehicleModel,
            year: formData.year,
            vehicle_plate_number: formData.vehicle_plate_number,
            vin_number: formData.vin_number,
            color: formData.color,
            fuel_type: formData.fuel_type,
            transmission: formData.transmission,
            registrationNumber: formData.registrationNumber,
            registration_State: formData.registration_State,
            registration_Expiry_Date: formData.registration_Expiry_Date,
            last_Inspection_Date: formData.last_Inspection_Date,
          },
        })
      ).unwrap();

      // if (isUpdating === true) {
      toast.toast({
        title: "Vehicle Updated Successfully",
      });
      dispatch(fetchDetailWithVehicle());
      // }
    } catch (error) {
      alert(`Failed to delete driver. Please try again. ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (registrationNumber: string) => {
    try {
      await dispatch(deleteVehicle(registrationNumber)).unwrap();
      if (isDeleteting === true) {
        toast.toast({
          title: "Vehicle Deleted Successfully",
          description: succeesMessage,
        });
        dispatch(fetchDetailWithVehicle());
      }
    } catch (error) {
      alert(`Failed to delete driver. Please try again. ${error}`);
      toast.toast({
        title: "Error Deleting Vehicle",
        description: "Failed to delete vehicle. Please try again.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span>
                <List />
              </span>
              <span>Vehicle List</span>
            </h1>
            <p className="text-gray-600 dark:text-white mt-1">
              Manage your taxi fleet and vehicle information
            </p>
          </div>
          <div className="w-full sm:w-auto flex justify-end mt-4 sm:mt-0">
            <Button
              className="redirect-button"
              type="submit"
              onClick={() => router.push("/admin/dashboard/RegsiterVehicle")}
            >
              <Plus />
              Register Vehicle
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                Total Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-900 dark:text-yellow-200">
                {paginatedVehicles.length}
              </div>
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                {paginatedVehicles.length > 0
                  ? `+${Math.floor(paginatedVehicles.length * 0.12)} this month`
                  : "No new vehicles"}
              </p>
            </CardContent>
          </Card>
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
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-900 dark:text-green-200">
                {paginatedVehicles.length}
              </div>
              <p className="text-xs text-green-600 mt-1 font-medium">
                {paginatedVehicles.length > 0
                  ? `${Math.round(
                      (paginatedVehicles.length / paginatedVehicles.length) *
                        100
                    )}% of fleet`
                  : "No active vehicles"}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search by name or email..."
              className="w-full sm:w-72 text-white border border-[#F5EF1B] placeholder-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}
        <div>
          <Card className="shadow-lg border-0 bg-gradient-to-br dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Fleet Overview</CardTitle>
                  <CardDescription>
                    Complete list of all vehicles in your fleet
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search Vehicle..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Responsive Table/Accordion for Vehicle List */}
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Vehicle Model</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Vehcile Plate Number</TableHead>
                      <TableHead>Maintenance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
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
                    ) : paginatedVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No vehicle found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedVehicles.map((vehicle) => (
                        <TableRow key={vehicle._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-base">
                                  {vehicle.company ? (
                                    vehicle.company
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  ) : (
                                    <Car className="h-5 w-5 text-blue-600" />
                                  )}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-200">
                                  {highlightMatch(
                                    vehicle?.company,
                                    debouncedsearch
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {vehicle.color
                                    ? vehicle.color.charAt(0).toUpperCase() +
                                      vehicle.color.slice(1)
                                    : ""}{" "}
                                  • {vehicle?._id?.slice(0, 8)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600 dark:text-gray-200">
                                  {vehicle?.vehicleModel}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {vehicle.vehicle_plate_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              VIN:{" "}
                              {vehicle.vin_number
                                ? `${vehicle.vin_number.slice(
                                    0,
                                    4
                                  )}...${vehicle.vin_number.slice(-4)}`
                                : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600 dark:text-gray-200">
                                  {vehicle?.year}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-gray-500 dark:text-gray-200">
                                {vehicle?.vehicle_plate_number
                                  ? vehicle.vehicle_plate_number
                                  : "Not Set"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <Wrench className="h-3 w-3 text-gray-400" />
                                <span>
                                  Last:{" "}
                                  {vehicle.registration_Expiry_Date
                                    ? new Date(
                                        vehicle.registration_Expiry_Date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <CalendarIcon className="h-3 w-3 text-gray-400" />
                                <span>
                                  Next:{" "}
                                  {vehicle.last_Inspection_Date
                                    ? new Date(
                                        vehicle.last_Inspection_Date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span
                                  className={`px-2 py-1 rounded-full font-semibold ${
                                    vehicle.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : vehicle.status === "inactive"
                                      ? "bg-gray-200 text-gray-700"
                                      : vehicle.status === "maintenance"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {vehicle.status
                                    ? vehicle.status.charAt(0).toUpperCase() +
                                      vehicle.status.slice(1)
                                    : "Unknown"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDialogOpen(vehicle, "view")
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                  View Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDialogOpen(vehicle, "edit")
                                  }
                                >
                                  <Pencil className="w-4 h-4" />
                                  Update Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDialogOpen(vehicle, "delete")
                                  }
                                >
                                  <Trash className="w-4 h-4" />
                                  Delete Vehicle
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile Accordion */}
              <div className="block sm:hidden">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">{error}</div>
                ) : paginatedVehicles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No vehicle found
                  </div>
                ) : (
                  <Accordion type="single" collapsible>
                    {paginatedVehicles.map((vehicle) => (
                      <AccordionItem key={vehicle._id} value={vehicle._id}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-base">
                                {vehicle.company ? (
                                  vehicle.company
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                ) : (
                                  <Car className="h-5 w-5 text-blue-600" />
                                )}
                              </span>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-medium text-gray-900 dark:text-gray-200 truncate">
                                {highlightMatch(
                                  vehicle?.company,
                                  debouncedsearch
                                )}
                              </span>
                              <span className="text-xs text-gray-500 truncate">
                                {vehicle?.vehicleModel}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 mr-2 rounded-full font-semibold text-xs ${
                                vehicle.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : vehicle.status === "inactive"
                                  ? "bg-gray-200 text-gray-700"
                                  : vehicle.status === "maintenance"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {vehicle.status
                                ? vehicle.status.charAt(0).toUpperCase() +
                                  vehicle.status.slice(1)
                                : "Unknown"}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-2 py-3 space-y-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <Car className="w-4 " />
                                <span className="block text-xs text-gray-400">
                                  License Plate
                                </span>
                              </div>
                              <span className="font-medium">
                                {vehicle.vehicle_plate_number}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <IdCardIcon className="w-4" />
                                <span className="block text-xs text-gray-400">
                                  VIN
                                </span>
                              </div>
                              <span className="font-medium">
                                {vehicle.vin_number
                                  ? `${vehicle.vin_number}`
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <div></div>
                              <span className="block text-xs text-gray-400">
                                Year
                              </span>
                              <span className="font-medium">
                                {vehicle.year}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs text-gray-400">
                                Color
                              </span>
                              <span className="font-medium">
                                {vehicle.color}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs text-gray-400">
                                Fuel Type
                              </span>
                              <span className="font-medium">
                                {vehicle.fuel_type}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs text-gray-400">
                                Transmission
                              </span>
                              <span className="font-medium">
                                {vehicle.transmission}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs text-gray-400">
                                Maintenance
                              </span>
                              <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1 text-xs">
                                  <Wrench className="h-3 w-3 text-gray-400" />
                                  Last:{" "}
                                  {vehicle.registration_Expiry_Date
                                    ? new Date(
                                        vehicle.registration_Expiry_Date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                                <span className="flex items-center gap-1 text-xs">
                                  <CalendarIcon className="h-3 w-3 text-gray-400" />
                                  Next:{" "}
                                  {vehicle.last_Inspection_Date
                                    ? new Date(
                                        vehicle.last_Inspection_Date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleDialogOpen(vehicle, "view")
                                }
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleDialogOpen(vehicle, "edit")
                                }
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleDialogOpen(vehicle, "delete")
                                }
                              >
                                <Trash className="w-4 h-4 mr-1" />
                                Delete
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

          <Dialog open={dialogType === "view"} onOpenChange={handleDialogClose}>
            <DialogContent className="max-w-2xl bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-2xl border-0 p-0 rounded-3xl overflow-hidden">
              <DialogHeader className="bg-blue-600 dark:bg-blue-900 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-blue-900">
                    <span className="text-blue-700 dark:text-blue-200 font-extrabold text-2xl">
                      {selectedVehicle?.company
                        ? selectedVehicle.company
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "V"}
                    </span>
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                      {selectedVehicle?.company
                        ? selectedVehicle.company.charAt(0).toUpperCase() +
                          selectedVehicle.company.slice(1)
                        : "Vehicle Profile"}
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 mt-1">
                      Detailed information about{" "}
                      {selectedVehicle?.company
                        ? selectedVehicle.company.charAt(0).toUpperCase() +
                          selectedVehicle.company.slice(1)
                        : "Vehicle Profile"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              {selectedVehicle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-8 bg-white dark:bg-slate-900">
                  {/* Left: Vehicle Info */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Vehicle Model
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.vehicleModel}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Year
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.year}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Plate Number
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.vehicle_plate_number || (
                          <span className="italic text-gray-400">Not Set</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        VIN Number
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.vin_number || (
                          <span className="italic text-gray-400">Not Set</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Registration Number
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.registrationNumber || (
                          <span className="italic text-gray-400">Not Set</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Registration State
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.registration_State || (
                          <span className="italic text-gray-400">Not Set</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Registration Expiry Date
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.registration_Expiry_Date
                          ? new Date(
                            selectedVehicle.registration_Expiry_Date
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Last Inspection Date
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.last_Inspection_Date ? new Date(selectedVehicle.last_Inspection_Date).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    {/* <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Vehicle ID
                      </Label>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                        {selectedVehicle._id}
                      </p>
                    </div> */}
                  </div>
                  {/* Right: Status & Company */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Company
                      </Label>
                      <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                        {selectedVehicle.company}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Status
                      </Label>
                      <div className="mt-1">
                        <Badge
                          className={`${
                            selectedVehicle.status === "Active"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : selectedVehicle.status === "Inactive"
                              ? "bg-gray-200 text-gray-600 border border-gray-300"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          }`}
                          variant="outline"
                        >
                          {selectedVehicle.status?.charAt(0).toUpperCase() +
                            selectedVehicle.status?.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Color
                      </Label>
                      <div className="flex items-center gap-2">
                        {selectedVehicle.color && (
                          <span
                            className="inline-block w-5 h-5 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: selectedVehicle.color,
                            }}
                            title={selectedVehicle.color}
                          />
                        )}
                        <span>{selectedVehicle.color}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Fuel Type
                      </Label>
                      <div className="flex items-center gap-2">
                        {selectedVehicle.fuel_type && (
                          <>
                            {selectedVehicle.fuel_type.toLowerCase() ===
                              "petrol" && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M7 2v2m10-2v2M5 6h14M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6" />
                                <rect
                                  x="9"
                                  y="10"
                                  width="6"
                                  height="8"
                                  rx="1"
                                />
                              </svg>
                            )}
                            {selectedVehicle.fuel_type.toLowerCase() ===
                              "diesel" && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 16v-1a4 4 0 014-4h10a4 4 0 014 4v1" />
                                <rect
                                  x="7"
                                  y="16"
                                  width="10"
                                  height="6"
                                  rx="2"
                                />
                              </svg>
                            )}
                            {selectedVehicle.fuel_type.toLowerCase() ===
                              "gas" && (
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="12" r="6" />
                                <path d="M12 8v4l2 2" />
                              </svg>
                            )}
                            {selectedVehicle.fuel_type.toLowerCase() ===
                              "cng" && (
                              <svg
                                className="w-4 h-4 text-yellow-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <rect
                                  x="4"
                                  y="8"
                                  width="16"
                                  height="8"
                                  rx="4"
                                />
                                <path d="M4 12h16" />
                              </svg>
                            )}
                            <span>{selectedVehicle.fuel_type}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Transmission
                      </Label>
                      <div className="mt-1">
                        <span>{selectedVehicle.transmission}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter className="bg-blue-50 dark:bg-slate-800 px-8 py-4 rounded-b-2xl flex justify-end">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-700 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-200 dark:hover:bg-blue-900"
                  onClick={handleDialogClose}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogType === "edit"} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[650px] border-0 shadow-2xl bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900  p-0 overflow-hidden">
              <DialogHeader className="space-y-0 pb-0">
                <div className="flex flex-col items-center justify-center bg-blue-600 dark:bg-blue-900 py-6 px-8 shadow-inner">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-blue-700 mb-2">
                    <span className="text-blue-700 dark:text-blue-200 font-extrabold text-2xl tracking-widest">
                      {selectedVehicle?.company
                        ? selectedVehicle?.company
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "V"}
                    </span>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                    {selectedVehicle?.company
                      ? selectedVehicle.company.charAt(0).toUpperCase() +
                        selectedVehicle.company.slice(1)
                      : "Vehicle Profile"}
                  </DialogTitle>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    Update Vehicle Information
                  </h3>
                  {/* <span className="block text-base font-medium text-blue-100 dark:text-yellow-200 mt-1">
                    {selectedVehicle?.company}
                  </span> */}
                </div>
              </DialogHeader>
              <div className="px-8 py-6">
                {iserror && (
                  <div className="mb-4">
                    <p className="text-red-500 text-center font-semibold bg-red-50 dark:bg-red-900 rounded py-2">
                      {iserror}
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="company"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        Make
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        placeholder="Enter Company Name"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: e.target.value,
                          })
                        }
                        className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vehicleModel"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        Vehicle Model
                      </Label>
                      <Input
                        id="vehicleModel"
                        type="text"
                        placeholder="Enter Vehicle Model"
                        value={formData.vehicleModel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleModel: e.target.value,
                          })
                        }
                        className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="year"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        Manufacture Year
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="Enter Year"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            year: Number(e.target.value),
                          })
                        }
                        className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vehicle_plate_number"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        VIN Number
                      </Label>
                      <Input
                        id="vin_number"
                        type="text"
                        placeholder="Enter VIN Number"
                        value={formData.vin_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vin_number: e.target.value,
                          })
                        }
                        className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vehicle_plate_number"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        License Plate
                      </Label>
                      <Input
                        id="vehicle_plate_number"
                        type="text"
                        placeholder="Enter the License Plate"
                        value={formData.vehicle_plate_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicle_plate_number: e.target.value,
                          })
                        }
                        className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="color"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        Color
                      </Label>
                      <Select
                        value={formData.color}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            color: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition">
                          <SelectValue placeholder="Select Color" />
                        </SelectTrigger>

                        <SelectContent className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border dark:border-gray-700">
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="White">White</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Gray">Gray</SelectItem>
                          <SelectItem value="Blue">Blue</SelectItem>
                          <SelectItem value="Red">Red</SelectItem>
                          <SelectItem value="Green">Green</SelectItem>
                          <SelectItem value="Yellow">Yellow</SelectItem>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="drivers_License_Number"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        Fuel Type
                      </Label>
                      <Select
                        value={formData.fuel_type}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            fuel_type: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition">
                          <SelectValue placeholder="Select Fuel Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border dark:border-gray-700">
                          <SelectItem
                            value="Petrol"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Petrol
                          </SelectItem>
                          <SelectItem
                            value="Diesel"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Diesel
                          </SelectItem>
                          <SelectItem
                            value="Electric"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Electric
                          </SelectItem>
                          <SelectItem
                            value="Hybrid"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Hybrid
                          </SelectItem>
                          <SelectItem
                            value="CNG"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            CNG
                          </SelectItem>
                          <SelectItem
                            value="LPG"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            LPG
                          </SelectItem>
                          <SelectItem
                            value="Other"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="drivers_License_Number"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        Transmission
                      </Label>
                      <Select
                        // value={transmission}
                        // onValueChange={setTransmission}
                        value={formData.transmission}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            transmission: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition">
                          <SelectValue placeholder="Select Transmission" />
                        </SelectTrigger>

                        <SelectContent className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border dark:border-gray-700">
                          <SelectItem
                            value="Automatic"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Automatic
                          </SelectItem>
                          <SelectItem
                            value="Manual"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Manual
                          </SelectItem>
                          <SelectItem
                            value="Semi-Automatic"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Semi-Automatic
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="companyName"
                            className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                          >
                            Registration Number
                          </Label>
                          <Input
                            type="text"
                            placeholder="Enter the Registration Number"
                            value={formData.registrationNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                registrationNumber: e.target.value,
                              })
                            }
                            // required
                            className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="vehicleModel"
                            className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                          >
                            Registration State
                          </Label>
                          <Input
                            type="text"
                            placeholder="Enter the Registration State"
                            value={formData.registration_State}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                registration_State: e.target.value,
                              })
                            }
                            className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                          >
                            Registration Expiry Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition text-zinc-800 dark:text-white bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900 placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none w-full justify-start text-left font-normal",
                                  // Add muted foreground if no date is selected
                                  !formData.registration_Expiry_Date &&
                                    "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.registration_Expiry_Date
                                  ? format(
                                      formData.registration_Expiry_Date,
                                      "PPP"
                                    )
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  formData.registration_Expiry_Date
                                    ? new Date(
                                        formData.registration_Expiry_Date
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setFormData({
                                    ...formData,
                                    registration_Expiry_Date: date
                                      ? date.toISOString()
                                      : "",
                                  })
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="drivers_License_Number"
                            className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                          >
                            Last Inspection Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition text-zinc-800 dark:text-white bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900 placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none w-full justify-start text-left font-normal",
                                  !formData.last_Inspection_Date &&
                                    "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.last_Inspection_Date
                                  ? format(formData.last_Inspection_Date, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  formData.last_Inspection_Date
                                    ? new Date(formData.last_Inspection_Date)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setFormData({
                                    ...formData,
                                    last_Inspection_Date: date
                                      ? date.toISOString()
                                      : "",
                                  })
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg tracking-wide shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        "Update Vehicle"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={dialogType === "delete"}
            onOpenChange={handleDialogClose}
          >
            <AlertDialogContent className="border-none p-0 overflow-hidden rounded-2xl shadow-2xl max-w-lg">
              <div className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 dark:from-red-900 dark:via-yellow-800 dark:to-yellow-600 px-8 py-6 flex flex-col items-center">
                <div className="bg-white dark:bg-slate-900 rounded-full p-3 shadow-lg mb-3 border-4 border-red-200 dark:border-yellow-700">
                  <svg
                    className="w-10 h-10 text-red-600 dark:text-yellow-300"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-30"
                    />
                    <path
                      d="M15 9l-6 6M9 9l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <AlertDialogTitle className="text-2xl font-bold text-white mb-1">
                  Delete Vehicle?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white text-base text-center font-medium">
                  Are you sure you want to{" "}
                  <span className="font-bold text-yellow-200">
                    permanently delete
                  </span>{" "}
                  the vehicle from <br />
                  <span className="font-bold text-white bg-red-700/70 px-2 py-1 rounded">
                    {selectedVehicle?.company || "this company"}
                  </span>
                  ?
                  <br />
                  <span className="text-sm text-yellow-100 font-normal">
                    This action cannot be undone.
                  </span>
                </AlertDialogDescription>
              </div>
              <div className="bg-white dark:bg-slate-900 px-8 py-6 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
                <AlertDialogCancel className="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={
                    selectedVehicle?.registrationNumber
                      ? () =>
                          handleDeleteVehicle(
                            selectedVehicle.registrationNumber
                          )
                      : undefined
                  }
                  className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold shadow hover:from-red-700 hover:to-yellow-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5 mr-1 -ml-1 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 9l-6 6M9 9l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
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
        __html: text.replace(regex, `<mark class="bg-gray-400">$1</mark>`),
      }}
    />
  );
};
