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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {format} from "date-fns";

export default function RegisterVehicle() {
  const [company, setCompany] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [vehicle_plate_number, setVehiclePlateNumber] = useState<string>("");

  const [expirydate, setExpirydate] = useState<Date>();
  const [lastInspectionDate, setLastInspectionDate] = useState<Date>();
  // const [status, setStatus] = useState("active");

  const dispatch = useDispatch<AppDispatch>();
  const { isloading, iserror } = useSelector(
    (state: RootState) => state.registerVehicle
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    dispatch(
      registerVehicle({
        company,
        vehicleModel,
        year: Number(year),
        vehicle_plate_number,
      })
    )
      .unwrap()
      .then(() => {
        setSuccess(true);
        setCompany("");
        setVehicleModel("");
        setYear("");
        setVehiclePlateNumber("");
        // setStatus("active");
      })
      .catch(() => {
        setSuccess(false);
      });
  };

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Plus />
          Add New Vehicle
        </h1>
        <div
          className="max-w-7xl w-full p-4 sm:p-6 md:p-8 mt-6 sm:mt-12 rounded-md
        "
        >
          {iserror && (
            <p className="text-red-500 text-center text-sm sm:text-base">
              {iserror}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-center text-sm sm:text-base font-semibold">
              Vehicle added successfully!
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
                <CardDescription>Basic details about the vehicle</CardDescription>  
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
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white  text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Model"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Manufacture Year</Label>
                    <Input
                      type="number"
                      placeholder="Enter the year"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">VIN Number</Label>
                    <Input
                      type="number"
                      placeholder="Enter the VIN Number"
                      // value={year}
                      // onChange={(e) => setYear(Number(e.target.value))}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
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
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Color</Label>
                    <Input
                      type="number"
                      placeholder="Enter the Color"
                      // value={year}
                      // onChange={(e) => setYear(Number(e.target.value))}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">
                    Fuel Type
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter the Fuel Type"
                      // value={vehicle_plate_number}
                      // onChange={(e) => setVehiclePlateNumber(e.target.value)}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">
                    Transmission
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter the Transmission"
                      // value={vehicle_plate_number}
                      // onChange={(e) => setVehiclePlateNumber(e.target.value)}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Registration & Documentation
                </CardTitle>
                <CardDescription>Legal documentation and registration details</CardDescription>  
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Registration Number</Label>
                    <Input
                      type="text"
                      placeholder="Enter the company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white  text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Registration State</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Registration State"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      required
                      className="w-full px-2 py-3 sm:px-4 sm:py-3 border text-zinc-800 dark:text-white text-base sm:text-lg bg-transparent placeholder:text-zinc-800 dark:placeholder:text-gray-400 rounded-md"
                    />
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
                          "w-full justify-start text-left font-normal",
                          !expirydate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expirydate ? format(expirydate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expirydate}
                        onSelect={setExpirydate}
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
                          "w-full justify-start text-left font-normal",
                          !lastInspectionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lastInspectionDate ? format(lastInspectionDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={lastInspectionDate}
                        onSelect={setLastInspectionDate}
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

            <Button
              type="submit"
              className="w-full rounded-md py-2 sm:py-3 text-base sm:text-lg font-semibold transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isloading ? "Adding..." : "Add Vehicle"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
