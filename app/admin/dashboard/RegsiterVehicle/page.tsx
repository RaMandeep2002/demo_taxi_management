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
  const [registration_State, setRegistration_State] = useState("");
  const [registration_Expiry_Date, setRegistration_Expiry_Date] = useState<Date>();
  const [last_Inspection_Date, setLast_Inspection_Date] = useState<Date>();

  // const [expirydate, setExpirydate] = useState<Date>();
  // const [lastInspectionDate, setLastInspectionDate] = useState<Date>();
  // const [status, setStatus] = useState("active");

  const dispatch = useDispatch<AppDispatch>();
  const { isloading, iserror } = useSelector(
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
  registration_Expiry_Date: registration_Expiry_Date ? registration_Expiry_Date.toISOString() : undefined,
  last_Inspection_Date: last_Inspection_Date ? last_Inspection_Date.toISOString() : undefined,
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
      setRegistration_State("");
      setRegistration_Expiry_Date(undefined);
      setLast_Inspection_Date(undefined);
      // setStatus("active");
    } catch (iserror) {
      toast.toast({
        title: "Error",
        description: `Failed to update driver: ${iserror}`,
        variant: "destructive",
      });
      setSuccess(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Plus />
          Add New Vehicle
        </h1>
        <div
          className="max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8 mt-6 sm:mt-12 rounded-md
        "
        >
          {iserror && (
            <p className="text-red-500 text-center text-sm sm:text-base">
              {iserror}
            </p>
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
                <CardTitle className="flex items-center gap-2">
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
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
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
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
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
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
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
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
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
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Color</Label>
                    <Input
                      type="name"
                      placeholder="Enter the Color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">Fuel Type</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Fuel Type"
                      value={fuel_type}
                      onChange={(e) => setFuel_type(e.target.value)}
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivers_License_Number">Transmission</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Transmission"
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 dark:bg-[#34363F] transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Registration & Documentation
                </CardTitle>
                <CardDescription>
                  Legal documentation and registration details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Registration Number</Label>
                    <Input
                      type="text"
                      placeholder="Enter the company name"
                      // value={company}
                      // onChange={(e) => setCompany(e.target.value)}
                      // required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Registration State</Label>
                    <Input
                      type="text"
                      placeholder="Enter the Registration State"
                      value={registration_State}
                      onChange={(e) => setRegistration_State(e.target.value)}
                      required
                      className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
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
