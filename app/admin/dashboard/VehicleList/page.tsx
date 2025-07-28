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
  AlertDialogFooter,
  AlertDialogHeader,
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
          <Card>
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
                    <TableHead>Year</TableHead>
                    <TableHead>Vehcile Plate Number</TableHead>
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
                      <TableCell colSpan={9} className="text-center text-black dark:text-white">
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
                                {vehicle?._id?.slice(0, 8)}
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

          <Dialog
            open={dialogType === "view"}
            onOpenChange={handleDialogClose}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Vehicle Profile</DialogTitle>
                <DialogDescription>
                  Detailed information about {selectedVehicle?.company}
                </DialogDescription>
              </DialogHeader>
              {selectedVehicle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-base">
                          {selectedVehicle.company
                            ? selectedVehicle.company
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "V"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {selectedVehicle.company}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedVehicle._id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Vehicle Model
                        </Label>
                        <p className="text-sm">{selectedVehicle.vehicleModel}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Year
                        </Label>
                        <p className="text-sm">{selectedVehicle.year}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Plate Number
                        </Label>
                        <p className="text-sm">
                          {selectedVehicle.vehicle_plate_number || "Not Set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Label className="text-sm font-medium text-gray-600">
                        Status
                      </Label>
                      <Badge
                        variant={
                          selectedVehicle.status === "Active"
                            ? "default"
                            : "outline"
                        }
                      >
                        {selectedVehicle.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogType === "edit"} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
              <DialogHeader className="space-y-3 pb-6 border-b border-slate-100">
                <DialogTitle className="text-slate-800 dark:text-white text-2xl font-bold flex items-center gap-3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow">
                      <span className="text-blue-600 font-bold text-xl">
                        {selectedVehicle?.company
                          ? selectedVehicle?.company
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "V"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Update Vehicle Information
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        Please update the details for the selected vehicle below.
                      </p>
                      <div className="mt-2">
                        <span className="block text-base font-medium text-blue-700 dark:text-yellow-300">
                          Company: {selectedVehicle?.company || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              {iserror && <p className="text-red-500 text-center">{iserror}</p>}
              <form
                onSubmit={handleSubmit} // Uncomment when ready to use
                className="space-y-6"
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="text-slate-700 dark:text-white font-medium flex items-center gap-2"
                    >
                      Company
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: e.target.value,
                        })
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehicleModel"
                      className="text-slate-700 dark:text-white font-medium flex items-center gap-2"
                    >
                      Vehicle Model
                    </Label>
                    <Input
                      id="vehicleModel"
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleModel: e.target.value,
                        })
                      }
                      // defaultValue={vehicle.vehicleModel}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="year"
                      className="text-slate-700 dark:text-white font-medium flex items-center gap-2"
                    >
                      Year
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: Number(e.target.value),
                        })
                      }
                      // defaultValue={vehicle.year}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="Plate-Number"
                      className="text-slate-700 dark:text-white font-medium flex items-center gap-2"
                    >
                      Vehicle Plate Number
                    </Label>
                    <Input
                      id="vehicle_plate_number"
                      type="text"
                      value={formData.vehicle_plate_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle_plate_number: e.target.value,
                        })
                      }
                      // defaultValue={vehicle.vehicle_plate_number}
                      className="h-11"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating.." : "Update Vehicle"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={dialogType === "delete"}
            onOpenChange={handleDialogClose}
          >
            <AlertDialogContent className="border-none">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to <span className="font-bold text-red-600">permanently delete</span> the vehicle from{" "}
                  <span className="font-bold text-blue-700">{selectedVehicle?.company || "this company"}</span>?<br />
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (selectedVehicle?.registrationNumber) {
                      handleDeleteVehicle(selectedVehicle.registrationNumber);
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
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
