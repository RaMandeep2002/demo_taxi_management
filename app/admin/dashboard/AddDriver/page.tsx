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
import { CalendarIcon, FileText, Lock, Plus, PlusCircleIcon, User } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

export default function AddDriver() {
  const [drivername, setDrivername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [driversLicenseNumber, setDriversLicenseNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [licenseExpiry, setLicenseExpiry] = useState<Date>();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, error, successMessage } = useSelector(
    (state: RootState) => state.addDriver
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white flex items-center gap-2">
          <span>
            <Plus className="h-6 w-6" />
          </span>
          Add New Driver
        </h1>
        <div
          className="max-w-6xl w-full p-4 sm:p-6 md:p-8 mt-6 sm:mt-12 rounded-md
        "
        >
          {error && (
            <p className="text-red-500 text-center text-sm sm:text-base">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-green-600 text-center text-sm sm:text-base font-semibold">
              {successMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Basic details about the driver
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      name="name"
                      autoComplete="off"
                      placeholder="Enter the name of Driver"
                      value={drivername}
                      onChange={(e) => setDrivername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      name="email"
                      autoComplete="off"
                      placeholder="Enter the Email of Driver"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value || "")}
                      className="PhoneInputInput w-full h-9 px-2 py-2 border text-zinc-800 dark:text-white rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="licenseState">License State</Label>
                    <Select>
                      <SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>License Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !licenseExpiry && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {licenseExpiry ? format(licenseExpiry, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={licenseExpiry}
                        onSelect={setLicenseExpiry}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_class">License Class</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">Class A</SelectItem>
                        <SelectItem value="cb">Class B</SelectItem>
                        <SelectItem value="cc">Class C</SelectItem>
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
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
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
                      className="pr-20"
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
    </DashboardLayout>
  );
}
