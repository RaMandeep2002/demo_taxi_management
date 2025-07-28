"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  List,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  EyeOff,
  Eye,
  User,
  PhoneCall,
  IdCard,
  LockIcon,
  Pencil,
  Trash,
  BadgeCheck,
} from "lucide-react";

import { fetchdriverdetails } from "@/app/admin/slices/slice/fetchingDriversSlice";
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
import { useToast } from "@/hooks/use-toast";
// import { Label } from "@/components/ui/label";
import { Drivers } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { updateDriver } from "../../slices/slice/updateDriverSlice";
import { deleteDriver } from "../../slices/slice/deleteDriverSlice";
import { useDebounce } from "@/lib/useDebounce";
// import { Avatar } from "@mui/material";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
// import { resetDriverPassword } from "../../slices/slice/resetPasswordSlice";

interface FormData {
  drivername: string;
  email: string;
  phoneNumber: string;
  driversLicenseNumber: string;
  password: string;
}

export default function DriverList() {
  const toast = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [dialogType, setDialogType] = useState<
    "profile" | "edit" | "delete" | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const dispatch = useDispatch<AppDispatch>();
  const {
    data: drivers,
    isLoading,
    isthereerror,
  } = useSelector((state: RootState) => state.driversFetching);
  const { isProcessing, iserror } = useSelector(
    (state: RootState) => state.updateDriverinfo
  );
  const { isDeleteting, succeesMessage } = useSelector(
    (state: RootState) => state.deleteDriver
  );

  // const { success } = useSelector((state: RootState) => state.resetPassword);
  const [selectedDriver, setSelectedDriver] = useState<Drivers | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleDialogOpen = (
    driver: Drivers,
    type: "profile" | "edit" | "delete"
  ) => {
    setSelectedDriver(driver);
    setDialogType(type);
  };

  const handleDialogClose = () => {
    setSelectedDriver(null);
    setDialogType(null);
  };

  const [formData, setFormData] = useState<FormData>({
    drivername: "",
    email: "",
    phoneNumber: "",
    driversLicenseNumber: "",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchdriverdetails());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDriver) {
      setFormData({
        drivername: selectedDriver.drivername,
        email: selectedDriver.email,
        phoneNumber: selectedDriver.phoneNumber.toString(),
        driversLicenseNumber: selectedDriver.driversLicenseNumber,
        password: "",
      });
    }
  }, [selectedDriver]);

  const filteredDrivers =
    drivers?.filter((driver) => {
      const matchesSearch =
        driver.drivername
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        driver.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        driver.driverId.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesSearch;
    }) || [];

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Allow +, numbers, spaces, parentheses, and dashes
    const cleanedValue = value.replace(/[^\d+\s()-]/g, "");
    if (value.includes("+")) {
      value = "+" + value.replace(/\+/g, "").trim();
    } else {
      value = "+" + value.trim();
    }
    setFormData((prev) => ({
      ...prev,
      phoneNumber: cleanedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDriver) {
      return;
    }

    try {
      await dispatch(
        updateDriver({
          driverId: selectedDriver.driverId,
          driverData: {
            drivername: formData.drivername,
            email: formData.email,
            driversLicenseNumber: formData.driversLicenseNumber,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
          },
        })
      ).unwrap();

      if (!iserror) {
        toast.toast({
          title: "Driver Updated Successfully",
        });
        dispatch(fetchdriverdetails());
      }
    } catch (error) {
      toast.toast({
        title: "Error",
        description: `Failed to update driver: ${error}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDriver = (driverId: string) => async () => {
    try {
      await dispatch(deleteDriver(driverId));
      if (!isDeleteting) {
        toast.toast({
          title: "Driver Deleted",
          description: succeesMessage,
        });
        dispatch(fetchdriverdetails());
      }
    } catch (error) {
      toast.toast({
        title: "Error",
        description: `Failed to delete driver: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white flex items-center gap-2">
              <span>
                <List />
              </span>
              <span>Driver List</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your taxi drivers and their performance
            </p>
          </div>
          <div className="w-full sm:w-auto flex justify-end mt-4 sm:mt-0">
            <Button
              className="w-full sm:w-auto"
              onClick={() => router.push("/admin/dashboard/AddDriver")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Register Driver
            </Button>
          </div>
        </div>

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
                    <TableHead>Driver</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>License No.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : isthereerror ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-black dark:text-white">
                        {isthereerror}
                      </TableCell>
                    </TableRow>
                  ) : filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDrivers.map((driver) => (
                      <TableRow key={driver._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-base">
                                {driver.drivername
                                  ? driver.drivername
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
                                  driver.drivername,
                                  debouncedSearch 
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(driver.driverId || driver._id)?.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400 dark:text-gray-200" />
                              <span className="text-gray-600 dark:text-white">
                                {driver.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400 dark:text-gray-200"/>
                                <span className="text-gray-600 dark:text-white">
                                <a href={`tel:${driver.phoneNumber}`}>
                                  {driver.phoneNumber}
                                </a>
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium text-gray-600 dark:text-white">
                              {driver.vehicle || "N/A"}
                            </div>
                            <div className="text-gray-600 dark:text-white">
                              License: {driver.driversLicenseNumber || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              driver.status === "Active"
                                ? "default"
                                : driver.status === "On Trip"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              driver.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : driver.status === "On Trip"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                            }
                          >
                            {driver.status || "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {driver.totalTrips
                              ? driver.totalTrips.toLocaleString()
                              : "0"}  
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-600 dark:text-yellow-300">
                            ${driver.totalEarnings || "0"}
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
                                  handleDialogOpen(driver, "profile")
                                }
                              >
                                <Eye className="w-4 h-4"/>
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDialogOpen(driver, "edit")}
                              >
                                <Pencil className="w-4 h-4"/>
                                Update Driver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDialogOpen(driver, "edit")}
                              >
                                <BadgeCheck className="w-4 h-4"/>
                                Approved Driver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDialogOpen(driver, "delete")
                                }
                              >
                                <Trash className="w-4 h-4"/>
                                Delete Driver
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
        </div>

        <Dialog
          open={dialogType === "profile"}
          onOpenChange={handleDialogClose}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Driver Profile</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedDriver?.drivername}
              </DialogDescription>
            </DialogHeader>
            {selectedDriver && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-base">
                        {selectedDriver.drivername
                          ? selectedDriver.drivername
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "D"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedDriver.drivername}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedDriver._id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Email
                      </Label>
                      <p className="text-sm">{selectedDriver.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Phone
                      </Label>
                      <p className="text-sm">{selectedDriver.phoneNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        License
                      </Label>
                      <p className="text-sm">
                        {selectedDriver.driversLicenseNumber}
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
                        selectedDriver.status === "Active"
                          ? "default"
                          : "outline"
                      }
                    >
                      {selectedDriver.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Total Trips
                    </Label>
                    <p className="text-sm font-semibold">
                      {selectedDriver.totalTrips.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Total Earnings
                    </Label>
                    <p className="text-sm font-semibold text-green-600 dark:text-yellow-300">
                      ${selectedDriver.totalEarnings}
                    </p>
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
                      {selectedDriver?.drivername
                        ? selectedDriver?.drivername
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "D"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Update Data for
                    </h3>
                    <span className="block text-base font-medium text-blue-700 dark:text-yellow-300">
                      {selectedDriver?.drivername}
                    </span>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            {iserror && <p className="text-red-500 text-center">{iserror}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="drivername"
                    className="text-slate-700 dark:text-white font-medium flex items-ce nter gap-2"
                  >
                    <User className="w-4 h-4" />
                    Driver Name
                  </Label>
                  <Input
                    id="drivername"
                    type="text"
                    placeholder="Enter Driver Name"
                    value={formData.drivername}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        drivername: e.target.value,
                      })
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-white font-medium flex items-ce nter gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-slate-700 dark:text-white font-medium flex items-ce nter gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="driversLicenseNumber"
                    className="text-slate-700 dark:text-white font-medium flex items-ce nter gap-2"
                  >
                    <IdCard className="w-4 h-4" />
                    License No.
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Driver's License Number"
                    value={formData.driversLicenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        driversLicenseNumber: e.target.value,
                      })
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 dark:text-white font-medium flex items-ce nter gap-2"
                  >
                    <LockIcon className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Updated Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-zinc-600 hover:text-zinc-800"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Updating..." : "Update Driver"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={dialogType === "delete"} onOpenChange={handleDialogClose}>
          <AlertDialogContent className="border-none">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to <span className="font-bold text-red-600">permanently delete</span> the driver{" "}
                <span className="font-bold text-slate-900 dark:text-yellow-300">{selectedDriver?.drivername}</span>?
                <br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={
                  selectedDriver?.driverId
                    ? handleDeleteDriver(selectedDriver.driverId)
                    : undefined
                }
                disabled={isDeleteting || !selectedDriver?.driverId}
              >
                {isDeleteting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
