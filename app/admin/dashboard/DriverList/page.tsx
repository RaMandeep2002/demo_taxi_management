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
  DollarSign,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {/* Total Drivers */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 transition-all hover:scale-[1.03]">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-yellow-400/20 rounded-full p-2">
                <User className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <CardTitle className="text-sm font-semibold text-yellow-700 dark:text-yellow-200">
                Total Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-900 dark:text-yellow-100">
                {filteredDrivers.length}
              </div>
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                {filteredDrivers.length > 0
                  ? `+${Math.floor(filteredDrivers.length * 0.12)} this month`
                  : "No new drivers"}
              </p>
            </CardContent>
          </Card>

          {/* Active Now */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 transition-all hover:scale-[1.03]">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-green-500/10 rounded-full p-2">
                <BadgeCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-200">
                Active Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-900 dark:text-green-100">
                {filteredDrivers.filter((d) => d.status === "available").length}
              </div>
              <p className="text-xs text-green-600 mt-1 font-medium">
                {filteredDrivers.length > 0
                  ? `${Math.round(
                      (filteredDrivers.filter((d) => d.status === "available").length /
                        filteredDrivers.length) *
                        100
                    )}% of total`
                  : "No active drivers"}
              </p>
            </CardContent>
          </Card>

          {/* Total Earnings */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-fuchsia-100 dark:from-purple-900 dark:to-fuchsia-900 transition-all hover:scale-[1.03]">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="bg-fuchsia-500/10 rounded-full p-2">
                {/* <span className="font-bold text-fuchsia-600 dark:text-fuchsia-300 text-lg">$</span> */}
                <DollarSign className="font-bold text-fuchsia-600 dark:text-fuchsia-300 text-lg"/>
              </div>
              <CardTitle className="text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-200">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-fuchsia-900 dark:text-fuchsia-100">
                $
                {filteredDrivers
                  .reduce((acc, driver) => acc + (driver.totalEarnings || 0), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-fuchsia-600 mt-1 font-medium">
                {filteredDrivers.length > 0
                  ? "+18% this month"
                  : "No earnings yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg overflow-hidden">
        <Card className="shadow-lg border-0 bg-gradient-to-br dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition">
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
                            {driver.totalEarnings !== undefined && driver.totalEarnings !== null
                              ? driver.totalEarnings.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })
                              : "$0"}
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
          <DialogContent className="max-w-2xl bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900  shadow-2xl border-0 p-0 rounded-3xl overflow-hidden">
            <DialogHeader className="bg-blue-600 dark:bg-blue-900 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-blue-900">
                  <span className="text-blue-700 dark:text-blue-200 font-extrabold text-2xl">
                    {selectedDriver?.drivername
                      ? selectedDriver.drivername
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "D"}
                  </span>
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                    {selectedDriver?.drivername || "Driver Profile"}
                  </DialogTitle>
                  <DialogDescription className="text-blue-100 mt-1">
                    Detailed information about {selectedDriver?.drivername}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            {selectedDriver && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-8 bg-white dark:bg-slate-900">
                {/* Left: Personal Info */}
                <div className="space-y-6">
                  {/* <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Driver ID
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {selectedDriver._id}
                    </p>
                  </div> */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Email
                    </Label>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                      {selectedDriver.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Phone
                    </Label>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                      {selectedDriver.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      License Number
                    </Label>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                      {selectedDriver.driversLicenseNumber || <span className="italic text-gray-400">N/A</span>}
                    </p>
                  </div>
                </div>
                {/* Right: Status & Stats */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        className={`px-3 py-1 text-base font-semibold rounded-full ${
                          selectedDriver.status === "available"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : selectedDriver.status === "busy"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                            : "bg-gray-200 text-gray-600 border border-gray-300"
                        }`}
                        variant="outline"
                      >
                        {selectedDriver.status.charAt(0).toUpperCase() + selectedDriver.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total Trips
                    </Label>
                    <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-200">
                      {selectedDriver.totalTrips?.toLocaleString() ?? 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total Earnings
                    </Label>
                    <p className="text-2xl font-extrabold text-green-600 dark:text-yellow-300">
                      ${selectedDriver.totalEarnings?.toLocaleString() ?? 0}
                    </p>
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
                    {selectedDriver?.drivername
                      ? selectedDriver?.drivername
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "D"}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  {selectedDriver?.drivername
                    ? selectedDriver.drivername.charAt(0).toUpperCase() + selectedDriver.drivername.slice(1)
                    : "Driver Profile"}
                </DialogTitle>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Update Driver Profile
                </h3>
                {/* <span className="block text-base font-medium text-blue-100 dark:text-yellow-200 mt-1">
                  {selectedDriver?.drivername}
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
                      htmlFor="drivername"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
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
                      className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
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
                      className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Enter Phone Number"
                      value={formData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="driversLicenseNumber"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
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
                      className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                    >
                      <LockIcon className="w-4 h-4" />
                      Password
                    </Label>
                    <div className="relative">
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
                        className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-300 transition"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg tracking-wide shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Update Driver"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={dialogType === "delete"} onOpenChange={handleDialogClose}>
          <AlertDialogContent className="border-none p-0 overflow-hidden rounded-2xl shadow-2xl max-w-lg">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 dark:from-red-900 dark:via-yellow-800 dark:to-yellow-600 px-8 py-6 flex flex-col items-center">
              <div className="bg-white dark:bg-slate-900 rounded-full p-3 shadow-lg mb-3 border-4 border-red-200 dark:border-yellow-700">
                <svg className="w-10 h-10 text-red-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-30"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-white mb-1">Delete Driver?</AlertDialogTitle>
              <AlertDialogDescription className="text-white text-base text-center font-medium">
                Are you sure you want to <span className="font-bold text-yellow-200">permanently delete</span> the driver <br />
                <span className="font-bold text-white bg-red-700/70 px-2 py-1 rounded">{selectedDriver?.drivername}</span>?
                <br />
                <span className="text-sm text-yellow-100 font-normal">This action cannot be undone.</span>
              </AlertDialogDescription>
            </div>
            <div className="bg-white dark:bg-slate-900 px-8 py-6 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
              <AlertDialogCancel className="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={
                  selectedDriver?.driverId
                    ? handleDeleteDriver(selectedDriver.driverId)
                    : undefined
                }
                disabled={isDeleteting || !selectedDriver?.driverId}
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold shadow hover:from-red-700 hover:to-yellow-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleteting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1 -ml-1 inline-block" fill="none" viewBox="0 0 24 24">
                      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </div>
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
