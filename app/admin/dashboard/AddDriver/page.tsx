"use client";
import DashboardLayout from "@/app/admin/DashBoardLayout";
import { addDriver } from "@/app/admin/slices/slice/addDriverSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import React, { useState } from "react";
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
  CalendarIcon,
  FileText,
  Lock,
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

export default function AddDriver() {
  const [drivername, setDrivername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [driversLicenseNumber, setDriversLicenseNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);

  const [licenseExpiry, setLicenseExpiry] = useState<Date>();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, error, successMessage } = useSelector(
    (state: RootState) => state.addDriver
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (phoneNumber === undefined) {
      alert("Please enter a valid phone number.");
      return;
    }
    const resultAction = dispatch(
      addDriver({
        drivername,
        email,
        driversLicenseNumber,
        phoneNumber: String(phoneNumber),
        password,
      })
    );
    if (addDriver.fulfilled.match(resultAction)) {
      setSuccess(true);
      setDrivername("");
      setEmail("");
      setDriversLicenseNumber("");
      setPhoneNumber("");
      setPassword("");
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
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-black dark:text-[#BAFB5D]">
          <span>
            <Plus className="h-6 w-6" />
          </span>
          Add New Driver
        </h1>
        <div
          className="max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-8 mt-6 sm:mt-12 rounded-md
        "
        >
          {error && (
            <p className="text-red-500 text-center text-sm sm:text-base">
              {error}
            </p>
          )}
          {successMessage && (
            <Dialog open={success} onOpenChange={setSuccess}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-green-600 dark:text-yellow-300 text-center">
                    New Driver added successfully!
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    The new vehicle has been added to your fleet.
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



<div className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto sm:p-6 md:p-8 mt-4">
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
                    <Label htmlFor="firstName" className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">Driver Name</Label>
                    <Input
                      type="text"
                      name="name"
                      autoComplete="off"
                      placeholder="Enter the name of Driver"
                      value={drivername}
                      onChange={(e) => setDrivername(e.target.value)}
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="lastName"    className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email"    className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">Email Address</Label>
                    <Input
                      type="email"
                      name="email"
                      autoComplete="off"
                      placeholder="Enter the Email of Driver"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone"    className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">Phone Number</Label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value || "")}
                      className="PhoneInputInput w-full h-9 px-2 py-2 border dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
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
                    <Label htmlFor="drivers_License_Number"    className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">
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
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseState" className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">License State</Label>
                    <Select>
                      <SelectTrigger className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label    className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">
                      License Expiry Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-2 border dark:border-gray-300 rounded-lg bg-transparent text-zinc-800 dark:text-white text-base focus:outline-none transition shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400",
                            !licenseExpiry && "text-zinc-400 dark:text-gray-400"
                          )}
                        >
                          <span className="flex items-center">
                            <CalendarIcon className="mr-2 h-5 w-5 text-indigo-500" />
                            {licenseExpiry ? (
                              <span>{format(licenseExpiry, "PPP")}</span>
                            ) : (
                              <span className="text-zinc-400 dark:text-gray-400">
                                Pick a date
                              </span>
                            )}
                          </span>
                          <span className="ml-2 text-xs text-gray-400 dark:text-gray-400">
                            {licenseExpiry ? "Change" : ""}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-lg shadow-lg border-0 bg-white dark:bg-zinc-900">
                        <Calendar
                          mode="single"
                          selected={licenseExpiry}
                          onSelect={setLicenseExpiry}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="license_class"    className="block text-sm sm:text-base font-semibold mb-1 tracking-wide">
                      License Class
                    </Label>
                    <Select>
                      <SelectTrigger className="border dark:border-gray-300 rounded-lg bg-transparent text-zinc-800 dark:text-white text-base focus:outline-none transition shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border dark:border-gray-700">
                        <SelectItem value="ca" className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition">Class A</SelectItem>
                        <SelectItem value="cb" className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition">Class B</SelectItem>
                        <SelectItem value="cc" className="hover:bg-indigo-100 dark:hover:bg-fuchsia-950 transition">Class C</SelectItem>
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
                      placeholder="Enter the Password for Driver"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-20 border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded-sm focus:outline-none hover:bg-zinc-200 text-zinc-700"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <span className="flex items-center gap-1">
                          {/* <span className="material-icons text-base">visibility_off</span> */}
                          Hide
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          {/* <span className="material-icons text-base">visibility</span> */}
                          Show
                        </span>
                      )}
                    </button>
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
                <p className="text-xs text-zinc-500 mt-2">
                  Password must be at least 8 characters and contain a mix of
                  letters and numbers.
                </p>
              </CardContent>
            </Card>

            <Button
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
            </Button>
          </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
