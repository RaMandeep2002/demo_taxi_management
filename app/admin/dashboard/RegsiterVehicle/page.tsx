"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/app/admin/DashBoardLayout";
import { AppDispatch, RootState } from "@/app/store/store";
import { registerVehicle } from "../../slices/slice/registerVehicleSlice";
import { CalendarIcon, Car, FileText, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterVehicle() {
  const toast = useToast();
  const [company, setCompany] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [vehicle_plate_number, setVehiclePlateNumber] = useState<string>("");
  const [vin_number, setVin_number] = useState("");
  const [color, setColor] = useState("");
  const [fuel_type, setFuel_type] = useState("");
  const [transmission, setTransmission] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registration_State, setRegistration_State] = useState("");
  const [registration_Expiry_Date, setRegistration_Expiry_Date] =
    useState<Date>();
  const [last_Inspection_Date, setLast_Inspection_Date] = useState<Date>();

  // const [expirydate, setExpirydate] = useState<Date>();
  // const [lastInspectionDate, setLastInspectionDate] = useState<Date>();
  // const [status, setStatus] = useState("active");

  const dispatch = useDispatch<AppDispatch>();
  const { isloading, validationErrors, iserror } = useSelector(
    (state: RootState) => state.registerVehicle
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await dispatch(
        registerVehicle({
          company,
          vehicleModel,
          year: Number(year),
          vehicle_plate_number,
          vin_number,
          color,
          fuel_type,
          transmission,
          registration_State,
          registrationNumber,
          registration_Expiry_Date: registration_Expiry_Date
            ? registration_Expiry_Date.toISOString()
            : undefined,
          last_Inspection_Date: last_Inspection_Date
            ? last_Inspection_Date.toISOString()
            : undefined,
        })
      ).unwrap();

      if (!iserror) {
        toast.toast({
          title: "Vehicle added successfully!",
        });
      }

      setCompany("");
      setVehicleModel("");
      setYear("");
      setVehiclePlateNumber("");
      setVin_number("");
      setColor("");
      setFuel_type("");
      setTransmission("");
      setRegistrationNumber("");
      setRegistration_State("");
      setRegistration_Expiry_Date(undefined);
      setLast_Inspection_Date(undefined);
      // setStatus("active");
    } catch (iserror) {
      toast.toast({
        title: "Error",
        description: `Failed to add vehicle. Please check the form for errors and try again.  ${
          iserror ? `` : ""
        }`,
        variant: "destructive",
      });
      setSuccess(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full sm:px-6 lg:px-10 mx-auto">
        <div className="flex flex-col items-start justify-center mt-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#BAFB5D] to-[#23272F] flex items-center justify-center shadow-lg">
              <Plus className="h-8 w-8 text-black dark:text-[#BAFB5D]" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Add New Vehicle
            </h1>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 text-center max-w-xl">
            Fill in the details below to register a new vehicle to your fleet.
          </p>
        </div>
        <div
          className="max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8 mt-6 sm:mt-12 rounded-md
        "
        >
          {iserror && (
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
                  {iserror}
                </span>
              </div>
            </div>
          )}

          {success && (
            <Dialog open={success} onOpenChange={setSuccess}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-green-600 dark:text-yellow-300 text-center">
                    Vehicle added successfully!
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

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-[#BAFB5D]">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
                <CardDescription>
                  Basic details about the vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Make</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Make"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    {/* Show error for 'company' field only */}
                    {validationErrors
                      .filter((err) => err.field === "company")
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
                    <Label htmlFor="vehicleModel">Model</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Model"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    {validationErrors
                      .filter((err) => err.field === "vehicleModel")
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
                    <Label htmlFor="phone">Manufacture Year</Label>
                    <Input
                      type="number"
                      placeholder="Enter the year"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    {validationErrors
                      .filter((err) => err.field === "year")
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">VIN Number</Label>
                    <Input
                      type="name"
                      placeholder="Enter the VIN Number"
                      value={vin_number}
                      onChange={(e) => setVin_number(e.target.value)}
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    {validationErrors
                      .filter((err) => err.field === "vin_number")
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
                    <Label htmlFor="drivers_License_Number">
                      License Plate
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter the License Plate"
                      value={vehicle_plate_number}
                      onChange={(e) => setVehiclePlateNumber(e.target.value)}
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    {validationErrors
                      .filter((err) => err.field === "vehicle_plate_number")
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Color</Label>
                    <Select value={color} onValueChange={setColor}>
                      <SelectTrigger className="border dark:border-gray-300 rounded-lg bg-transparent text-zinc-800 dark:text-white text-base focus:outline-none transition shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder="Select Color" />
                      </SelectTrigger>
                      {validationErrors
                        .filter((err) => err.field === "color")
                        .map((err, i) => (
                          <p
                            key={i}
                            className="mt-1 text-sm text-red-600 dark:text-red-300"
                          >
                            {err.message}
                          </p>
                        ))}
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
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">Fuel Type</Label>
                    <Select value={fuel_type} onValueChange={setFuel_type}>
                      <SelectTrigger className="border dark:border-gray-300 rounded-lg bg-transparent text-zinc-800 dark:text-white text-base focus:outline-none transition shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder="Select Fuel Type" />
                      </SelectTrigger>

                      {validationErrors
                        .filter((err) => err.field === "fuel_type")
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
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">Transmission</Label>
                    <Select
                      value={transmission}
                      onValueChange={setTransmission}
                    >
                      <SelectTrigger className="border dark:border-gray-300 rounded-lg bg-transparent text-zinc-800 dark:text-white text-base focus:outline-none transition shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder="Select Transmission" />
                      </SelectTrigger>
                      {validationErrors
                        .filter((err) => err.field === "transmission")
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
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-[#BAFB5D]">
                  <FileText className="h-5 w-5" />
                  Registration
                </CardTitle>
                <CardDescription>Registration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Registration Number</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Registration Number"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      // required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    {validationErrors
                      .filter((err) => err.field === "registrationNumber")
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
                    <Label htmlFor="vehicleModel">Registration State</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Registration State"
                      value={registration_State}
                      onChange={(e) => setRegistration_State(e.target.value)}
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                    {validationErrors
                      .filter((err) => err.field === "registration_State")
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Registration Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "border dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent hover:bg-transparent placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition w-full justify-start text-left font-normal",
                            !registration_Expiry_Date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {registration_Expiry_Date
                            ? format(registration_Expiry_Date, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      {validationErrors
                        .filter(
                          (err) => err.field === "registration_Expiry_Date"
                        )
                        .map((err, i) => (
                          <p
                            key={i}
                            className="mt-1 text-sm text-red-600 dark:text-red-300"
                          >
                            {err.message}
                          </p>
                        ))}
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={registration_Expiry_Date}
                          onSelect={setRegistration_Expiry_Date}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">
                      Last Inspection Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "border dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent hover:bg-transparent placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition w-full justify-start text-left font-normal",
                            !last_Inspection_Date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {last_Inspection_Date
                            ? format(last_Inspection_Date, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={last_Inspection_Date}
                          onSelect={setLast_Inspection_Date}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <div>
              <label className="block text-base sm:text-lg font-medium text-zinc-800">
                Company
              </label>
              <input
                type="text"
                placeholder="Enter the company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full px-2 py-3 sm:px-4 sm:py-3 border border-zinc-800 text-zinc-800 text-base sm:text-lg bg-transparent placeholder:text-zinc-800 rounded-md"
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-medium text-zinc-800">
                Vehicle Model
              </label>
              <input
                type="text"
                placeholder="Enter the vehicle model"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                required
                className="w-full px-2 py-3 sm:px-4 sm:py-3 border border-zinc-800 text-zinc-800 text-base sm:text-lg bg-transparent placeholder:text-zinc-800 rounded-md"
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-medium text-zinc-800">
                Year
              </label>
              <input
                type="number"
                placeholder="Enter the year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
                className="w-full px-2 py-3 sm:px-4 sm:py-3 border border-zinc-800 text-zinc-800 text-base sm:text-lg bg-transparent placeholder:text-zinc-800 rounded-md"
              />
            </div>
            <div>
              <label className="block text-base sm:text-lg font-medium text-zinc-800">
                Vehcile Plate Number
              </label>
              <input
                type="text"
                placeholder="Enter the Plate Number"
                value={vehicle_plate_number}
                onChange={(e) => setVehiclePlateNumber(e.target.value)}
                required
                className="w-full px-2 py-3 sm:px-4 sm:py-3 border border-zinc-800 text-zinc-800 text-base sm:text-lg bg-transparent placeholder:text-zinc-800 rounded-md"
              />
            </div> */}

            {/* <div>
               <label className="block text-base sm:text-lg font-medium text-zinc-800">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-800 rounded-lg text-zinc-800 bg-transparent"
              >
                <option value="active">Active</option>
                <option value="free">Free</option>
              </select>
            </div> */}

            <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-[#BAFB5D]">
                  <FileText className="h-5 w-5" />
                  Vehicle Registration Details
                </CardTitle>
                <CardDescription>
                  Please review and submit the vehicle registration details
                  below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button className="px-8 py-4 font-bold text-lg bg-black text-white dark:bg-[#BAFB5D] dark:text-black  transition-colors shadow tracking-wide hover:bg-gray-900 dark:hover:bg-[#BAFB5D] flex items-center gap-3 duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto">
                    {isloading ? "Submitting..." : "Submit Vehicle"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="px-6 py-4 font-bold text-lg bg-black text-white dark:bg-[#BAFB5D] dark:text-black rounded-full transition-colors shadow tracking-wide hover:bg-gray-900 dark:hover:bg-[#BAFB5D] flex items-center gap-3 duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                  w-full sm:w-auto"
              >
                {isloading ? "Adding..." : "Add Vehicle"}
              </Button>
            </div> */}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
