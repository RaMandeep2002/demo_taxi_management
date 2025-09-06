"use client";
import DashboardLayout from "@/app/admin/DashBoardLayout";
import { addDriver } from "@/app/admin/slices/slice/addDriverSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeCheck,
  CalendarIcon,
  Eye,
  EyeOff,
  FileText,
  IdCard,
  Lock,
  Mail,
  Map,
  Phone,
  Plus,
  PlusCircleIcon,
  User,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AddDriver() {
  const toast = useToast();
  const [drivername, setDrivername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [driversLicenseNumber, setDriversLicenseNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [licenseState, setLicenseState] = useState<string>("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<Date>();
  const [licenseClass, setLicenseClass] = useState<string>("");

  // const [licenseExpiry, setLicenseExpiry] = useState<Date>();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, error, validationErrors, successMessage } = useSelector(
    (state: RootState) => state.addDriver
  );
  
  useEffect(()=>{
    // console.log("formattedLicenseExpiryDate ===> ", formattedLicenseExpiryDate)
    console.log("licenseExpiryDate ===> ", licenseExpiryDate)
  },[licenseExpiryDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    // let formattedLicenseExpiryDate: string | undefined = undefined;
    // // Prepare license expiry date in YYYY/MM/DD format if present
    // if (licenseExpiryDate) {
    //   // Format the date as "Thu Sep 25 2025"
    //   formattedLicenseExpiryDate = licenseExpiryDate.toDateString();
    // }

    // console.log("formattedLicenseExpiryDate ===> ", formattedLicenseExpiryDate)
    // console.log("licenseExpiryDate ===> ", licenseExpiryDate)

    try {
      const resultAction = await dispatch(
        addDriver({
          drivername,
          email,
          driversLicenseNumber,
          phoneNumber,
          password,
          licenseState,
          licenseExpiryDate: licenseExpiryDate?.toDateString(),
          licenseClass,
        })
      );

      if (addDriver.fulfilled.match(resultAction)) {
        setSuccess(true);
        setDrivername("");
        setEmail("");
        setDriversLicenseNumber("");
        setPhoneNumber("");
        setLicenseState("");
        setLicenseExpiryDate(undefined);
        setLicenseClass("");
        setPassword("");

        toast.toast({
          title: "Driver added successfully!",
        });
      } else if (addDriver.rejected.match(resultAction)) {
        // Show error from payload if available
        const errorMsg =
          resultAction.payload?.message || "Failed to add driver.";
        toast.toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast.toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : String(error) || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value;
  //   const cleanedValue = value.replace(/[^\d+\s()-]/g, "");

  //   if (value.includes("+")) {
  //     value = "+" + value.replace(/\+/g, "").trim();
  //   } else {
  //     value = "+" + value.trim();
  //   }

  //   setPhoneNumber(cleanedValue);
  // };

  const generatePassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // bg-gradient-to-r from-slate-900 to-slate-700
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto">
        <div className="flex flex-col items-start justify-center mt-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#BAFB5D] to-[#23272F] flex items-center justify-center shadow-lg">
              <Plus className="h-8 w-8 text-black dark:text-[#BAFB5D]" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Add New Driver
            </h1>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 text-start max-w-xl">
          Create a new driver account to add to your fleet. Fill in the
          details below to get started.
          </p>
        </div>
        <div
          className="max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-8  rounded-md
        "
        >
          {error && (
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm w-full max-w-xl">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0ZM12 7v4m0 4h.01"
                  />
                </svg>
                <span className="text-sm sm:text-base font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          {successMessage && (
            <Dialog open={success} onOpenChange={setSuccess}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-green-600 dark:text-yellow-300 text-center">
                    New Driver added successfully!
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    The new Driver has been added.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-4">
                  <Button onClick={() => setSuccess(false)} autoFocus>
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <div className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-[#BAFB5D]">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about the driver
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Driver Name
                      </Label>
                      <Input
                        type="text"
                        name="name"
                        autoComplete="off"
                        placeholder="Enter the name of Driver"
                        value={drivername}
                        onChange={(e) => setDrivername(e.target.value)}
                        className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                      />
                      {validationErrors
                        .filter((err) => err.field === "drivername")
                        .map((err, i) => (
                          <p
                            key={i}
                            className="mt-1 text-sm text-red-600 dark:text-red-300"
                          >
                            {err.message}
                          </p>
                        ))}
                    </div>
                    {/* <div className="space-y-2">
                    <Label htmlFor="lastName"    className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        autoComplete="off"
                        placeholder="Enter the Email of Driver"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                      />
                      {validationErrors
                        .filter((err) => err.field === "email")
                        .map((err, i) => (
                          <p
                            key={i}
                            className="mt-1 text-sm text-red-600 dark:text-red-300"
                          >
                            {err.message}
                          </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number
                      </Label>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value || "")}
                        className="PhoneInputInput w-full h-9 px-2 py-2 border dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                      />
                      {validationErrors
                        .filter((err) => err.field === "phoneNumber")
                        .map((err, i) => (
                          <p
                            key={i}
                            className="mt-1 text-sm text-red-600 dark:text-red-300"
                          >
                            {err.message}
                          </p>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-[#BAFB5D]">
                    <FileText className="h-5 w-5" />
                    License & Verification
                  </CardTitle>
                  <CardDescription>
                    Driver&apos;s license and document verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="drivers_License_Number"
                        className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        <IdCard className="w-4 h-4 mr-2" />
                        Drivers License Number
                      </Label>
                      <Input
                        type="text"
                        name="driversLicenseNumber"
                        autoComplete="off"
                        placeholder="Enter the Drivers License Number of Driver"
                        value={driversLicenseNumber}
                        onChange={(e) =>
                          setDriversLicenseNumber(e.target.value)
                        }
                        className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                      />
                      {validationErrors
                        .filter((err) => err.field === "driversLicenseNumber")
                        .map((err, i) => (
                          <p
                            key={i}
                            className="mt-1 text-sm text-red-600 dark:text-red-300"
                          >
                            {err.message}
                          </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="licenseState"
                        className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                            <Map className="w-4 h-4 mr-2" />
                        License State
                      </Label>
                      <Select
                        value={licenseState}
                        onValueChange={setLicenseState}
                      >
                        <SelectTrigger className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        {validationErrors
                          .filter((err) => err.field === "licenseState")
                          .map((err, i) => (
                            <p
                              key={i}
                              className="mt-1 text-sm text-red-600 dark:text-red-300"
                            >
                              {err.message}
                            </p>
                          ))}
                        <SelectContent>
                          <SelectItem value="Alabama">Alabama</SelectItem>
                          <SelectItem value="Alaska">Alaska</SelectItem>
                          <SelectItem value="Arizona">Arizona</SelectItem>
                          <SelectItem value="Arkansas">Arkansas</SelectItem>
                          <SelectItem value="California">California</SelectItem>
                          <SelectItem value="Colorado">Colorado</SelectItem>
                          <SelectItem value="Connecticut">
                            Connecticut
                          </SelectItem>
                          <SelectItem value="Delaware">Delaware</SelectItem>
                          <SelectItem value="Florida">Florida</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Hawaii">Hawaii</SelectItem>
                          <SelectItem value="Idaho">Idaho</SelectItem>
                          <SelectItem value="Illinois">Illinois</SelectItem>
                          <SelectItem value="Indiana">Indiana</SelectItem>
                          <SelectItem value="Iowa">Iowa</SelectItem>
                          <SelectItem value="Kansas">Kansas</SelectItem>
                          <SelectItem value="Kentucky">Kentucky</SelectItem>
                          <SelectItem value="Louisiana">Louisiana</SelectItem>
                          <SelectItem value="Maine">Maine</SelectItem>
                          <SelectItem value="Maryland">Maryland</SelectItem>
                          <SelectItem value="Massachusetts">
                            Massachusetts
                          </SelectItem>
                          <SelectItem value="Michigan">Michigan</SelectItem>
                          <SelectItem value="Minnesota">Minnesota</SelectItem>
                          <SelectItem value="Mississippi">
                            Mississippi
                          </SelectItem>
                          <SelectItem value="Missouri">Missouri</SelectItem>
                          <SelectItem value="Montana">Montana</SelectItem>
                          <SelectItem value="Nebraska">Nebraska</SelectItem>
                          <SelectItem value="Nevada">Nevada</SelectItem>
                          <SelectItem value="New Hampshire">
                            New Hampshire
                          </SelectItem>
                          <SelectItem value="New Jersey">New Jersey</SelectItem>
                          <SelectItem value="New Mexico">New Mexico</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="North Carolina">
                            North Carolina
                          </SelectItem>
                          <SelectItem value="North Dakota">
                            North Dakota
                          </SelectItem>
                          <SelectItem value="Ohio">Ohio</SelectItem>
                          <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                          <SelectItem value="Oregon">Oregon</SelectItem>
                          <SelectItem value="Pennsylvania">
                            Pennsylvania
                          </SelectItem>
                          <SelectItem value="Rhode Island">
                            Rhode Island
                          </SelectItem>
                          <SelectItem value="South Carolina">
                            South Carolina
                          </SelectItem>
                          <SelectItem value="South Dakota">
                            South Dakota
                          </SelectItem>
                          <SelectItem value="Tennessee">Tennessee</SelectItem>
                          <SelectItem value="Texas">Texas</SelectItem>
                          <SelectItem value="Utah">Utah</SelectItem>
                          <SelectItem value="Vermont">Vermont</SelectItem>
                          <SelectItem value="Virginia">Virginia</SelectItem>
                          <SelectItem value="Washington">Washington</SelectItem>
                          <SelectItem value="West Virginia">
                            West Virginia
                          </SelectItem>
                          <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                          <SelectItem value="Wyoming">Wyoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        License Expiry Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 border dark:border-gray-300 rounded-lg bg-transparent text-zinc-800 dark:text-white text-base focus:outline-none transition shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400",
                              !licenseExpiryDate &&
                                "text-zinc-400 dark:text-gray-400"
                            )}
                          >
                            <span className="flex items-center">
                              <CalendarIcon className="mr-2 h-5 text-indigo-500" />
                              {licenseExpiryDate ? (
                                <span>{format(licenseExpiryDate, "PPP")}</span>
                              ) : (
                                <span className="text-zinc-400 dark:text-gray-400">
                                  Pick a date
                                </span>
                              )}
                            </span>
                            <span className="ml-2 text-xs text-gray-400 dark:text-gray-400">
                              {licenseExpiryDate ? "Change" : ""}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        {validationErrors
                          .filter((err) => err.field === "licenseExpiryDate")
                          .map((err, i) => (
                            <p
                              key={i}
                              className="mt-1 text-sm text-red-600 dark:text-red-300"
                            >
                              {err.message}
                            </p>
                          ))}
                        <PopoverContent className="w-auto p-0 rounded-lg shadow-lg border-0 bg-white dark:bg-zinc-900">
                          <Calendar
                            mode="single"
                            selected={licenseExpiryDate}
                            onSelect={setLicenseExpiryDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="license_class"
                        className="flex items-center text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        <span className="flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4" />
                          License Class
                        </span>
                      </Label>
                      <Select
                        value={licenseClass}
                        onValueChange={setLicenseClass}
                      >
                        <SelectTrigger className="border dark:border-gray-300 rounded-lg bg-transparent text-zinc-800 dark:text-white text-base focus:outline-none transition shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        {validationErrors
                          .filter((err) => err.field === "licenseClass")
                          .map((err, i) => (
                            <p
                              key={i}
                              className="mt-1 text-sm text-red-600 dark:text-red-300"
                            >
                              {err.message}
                            </p>
                          ))}
                        <SelectContent className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border dark:border-gray-700">
                          <SelectItem
                            value="A"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Class A
                          </SelectItem>
                          <SelectItem
                            value="B"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Class B
                          </SelectItem>
                          <SelectItem
                            value="C"
                            className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition"
                          >
                            Class C
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">
                      Drivers License Number
                    </Label>
                    <Input
                      type="text"
                      name="driversLicenseNumber"
                      autoComplete="off"
                      placeholder="Enter the Drivers License Number of Driver"
                      value={driversLicenseNumber}
                      onChange={(e) => setDriversLicenseNumber(e.target.value)}
                      required
                    />
                  </div>
                </div> */}
                </CardContent>
              </Card>

              {/* Styled Password Section */}
              <Card className="mt-4 shadow-lg border-0 dark:bg-[#34363F] transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-[#BAFB5D]">
                    <Lock />
                    <span>Password</span>
                  </CardTitle>
                  <CardDescription>
                    Set a secure password for the driver. You can generate a
                    strong password or show/hide the password for convenience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter the Password for Admin"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                      />
                      <Button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded focus:outline-none hover:bg-zinc-200 text-zinc-700 h-6 min-h-0"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Hide
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff className="h-4 w-4" />
                            Show
                          </span>
                        )}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      onClick={generatePassword}
                      // className="w-full sm:w-auto text-white bg-black py-2 px-4 text-sm sm:text-base font-semibold rounded-md transition duration-300 flex items-center justify-center gap-2"
                    >
                      {/* <span className="material-icons text-base">autorenew</span> */}
                      Generate Password
                    </Button>
                  </div>
                  {validationErrors
                    .filter((err) => err.field === "password")
                    .map((err, i) => (
                      <p
                        key={i}
                        className="mt-1 text-sm text-red-600 dark:text-red-300"
                      >
                        {err.message}
                      </p>
                    ))}
                  <p className="text-xs text-zinc-500 mt-2">
                    Password must be at least 8 characters and contain a mix of
                    letters and numbers.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="text-lg font-semibold">
                      Driver Registration Details
                    </span>
                  </CardTitle>
                  <CardDescription>
                    <span className="text-zinc-600 dark:text-zinc-300">
                      Please review and submit the driver registration details
                      above.
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-20 h-20 rounded-full bg-[#BAFB5D] dark:bg-[#23272F] flex items-center justify-center shadow mb-4">
                      <FileText className="h-10 w-10 text-black dark:text-[#BAFB5D]" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                      Ready to Add Driver?
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-300 text-center max-w-md">
                      Please ensure all information above is correct. When you are ready, click the button below to add the new driver to your fleet.
                    </p>
                  </div> */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 font-bold text-lg bg-black text-white dark:bg-[#BAFB5D] dark:text-black  transition-colors shadow tracking-wide hover:bg-gray-900 dark:hover:bg-[#BAFB5D] flex items-center gap-3 duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-6 w-6 text-white dark:text-black"
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
                          Adding...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <PlusCircleIcon className="h-6 w-6" />
                          Add Driver
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white dark:text-black rounded-md py-2 sm:py-3 text-base sm:text-lg font-semibold transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Adding..."
                ) : (
                  <span className="flex items-center gap-2">
                    <PlusCircleIcon />
                    Add Driver
                  </span>
                )}
              </Button> */}
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
