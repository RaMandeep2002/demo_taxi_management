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
  Calendar,
} from "lucide-react";

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
  });
  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        company: selectedVehicle.company || "",
        vehicleModel: selectedVehicle.vehicleModel || "",
        year: selectedVehicle.year || 0,
        vehicle_plate_number: selectedVehicle.vehicle_plate_number || "",
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
              className="w-full sm:w-auto"
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
        <div className="border rounded-lg overflow-hidden">
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
                                {/* {vehicle.company
                                  ? vehicle.company
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  :   <Car className="h-5 w-5 text-blue-600" />} */}
                                <Car className="h-5 w-5 text-blue-600" />
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
                              {/* <Mail className="h-3 w-3 text-gray-400" /> */}
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
                            VIN: {vehicle.vin_number.slice(-6)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              {/* <Mail className="h-3 w-3 text-gray-400" /> */}
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
                                Last: {vehicle.registration_Expiry_Date ? new Date(vehicle.registration_Expiry_Date).toLocaleDateString() : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span>
                                Next: {vehicle.last_Inspection_Date ? new Date(vehicle.last_Inspection_Date).toLocaleDateString() : "N/A"}
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
                      {selectedVehicle?.company || "Vehicle Profile"}
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 mt-1">
                      Detailed information about {selectedVehicle?.company}
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
                          className={`px-3 py-1 text-base font-semibold rounded-full ${
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
            <DialogContent className="sm:max-w-[520px] border-0 shadow-2xl bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900  p-0 overflow-hidden">
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
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="company"
                        className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                      >
                        Company
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
                        Year
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
                        Vehicle Plate Number
                      </Label>
                      <Input
                        id="vehicle_plate_number"
                        type="text"
                        placeholder="Enter Vehicle Plate Number"
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
