"use client";

import React, { useState } from "react";
import DashboardLayout from "../../DashBoardLayout";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import { scheduleRide } from "../../slices/slice/scheduleRideSlice";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock10, Map, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { CheckboxItem } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export default function ScheduleRide() {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [customerName, setCustomerName] = useState("");
  const [customer_phone_number, setcustomer_phone_number] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropOffAddress, setDropOffAddress] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<Date | null>(null);

  const { loading, error, success } = useSelector(
    (state: RootState) => state.scheduleRIde
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (customer_phone_number === undefined) {
      alert("Please enter a valid phone number.");
      return;
    }

    const formattedDate = pickupDate ? format(pickupDate, "MM/dd/yyyy") : "";
    console.log("formattedDate ===> ", formattedDate);
    const formattedTime = pickupTime ? format(pickupTime, "hh:mma") : "";
    console.log("formattedTime ===> ", formattedTime);

    const resultAction = await dispatch(
      scheduleRide({
        customerName,
        customer_phone_number,
        time: formattedTime,
        date: formattedDate,
        pickupAddress,
        dropOffAddress,
      })
    );
    if (scheduleRide.fulfilled.match(resultAction)) {
      toast.toast({
        title: "Ride Scheduled",
        description: "The ride has been scheduled successfully.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <span>
              <Clock10 />
            </span>
            <span>Schedule Ride</span>
          </h1>
          <p className="mt-1">Create a new ride booking for customers</p>
        </div>

        <div className="max-w-5xl p-6 mt-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {success && (
              <p className="text-black">Ride scheduled successfully!</p>
            )}
            {error && <p className="text-red-600">{error}</p>}
            {/* Customer Name */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
                <CardDescription>Details about the passenger</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="customerName"
                      className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                    >
                      Customer Name
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      autoComplete="off"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter full name"
                      // className="w-full px-4 py-3 border border-zinc-800 text-zinc-800 rounded-lg bg-transparent  placeholder:text-zinc-600 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="customerPhone"
                      className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                    >
                      Phone Number
                    </Label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      placeholder="Enter phone number"
                      value={customer_phone_number}
                      onChange={(value) =>
                        setcustomer_phone_number(value || "")
                      }
                      className="PhoneInputInput w-full h-9 px-2 py-2 border border-gray-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg  placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                    >
                      Customer Email
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      autoComplete="off"
                      // value={customerName}
                      // onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter Customer Email"
                      // className="w-full px-4 py-3 border border-zinc-800 text-zinc-800 rounded-lg bg-transparent  placeholder:text-zinc-600 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Passenger</SelectItem>
                        <SelectItem value="2">2 Passengers</SelectItem>
                        <SelectItem value="3">3 Passengers</SelectItem>
                        <SelectItem value="4">4 Passengers</SelectItem>
                        <SelectItem value="5">5+ Passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Pickup and destination information
                </CardTitle>
                <CardDescription>
                  Pickup and destination information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pickup Address */}
                  <div>
                    <Label
                      htmlFor="pickup-address"
                      className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                    >
                      Pick Up Address
                    </Label>
                    <Input
                      id="pickup-address"
                      type="text"
                      name="pickup-address"
                      autoComplete="off"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Enter Pick Up Address"
                      className="w-full h-10 px-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-base text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>
                  {/* Drop Off Address */}
                  <div>
                    <Label
                      htmlFor="dropoff-address"
                      className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                    >
                      Drop Off Address
                    </Label>
                    <Input
                      id="dropoff-address"
                      type="text"
                      name="dropoff-address"
                      autoComplete="off"
                      value={dropOffAddress}
                      onChange={(e) => setDropOffAddress(e.target.value)}
                      placeholder="Enter Drop Off Address"
                      className="w-full h-10 px-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-base text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    />
                  </div>
                </div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Date */}
                    <div>
                      <Label
                        htmlFor="pickup-date"
                        className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        Pickup Date
                      </Label>
                      <DatePicker
                        value={pickupDate}
                        onChange={setPickupDate}
                        slotProps={{
                          textField: {
                            id: "pickup-date",
                            fullWidth: true,
                            placeholder: "MM/DD/YYYY",
                            InputProps: {
                              className:
                                "w-full h-10 px-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition",
                            },
                            InputLabelProps: {
                              className: "text-zinc-700 dark:text-zinc-300",
                            },
                          },
                        }}
                      />
                    </div>
                    {/* Pickup Time */}
                    <div>
                      <Label
                        htmlFor="pickup-time"
                        className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        Pickup Time
                      </Label>
                      <TimePicker
                        value={pickupTime}
                        onChange={setPickupTime}
                        slotProps={{
                          textField: {
                            id: "pickup-time",
                            fullWidth: true,
                            InputProps: {
                              className:
                                "w-full h-10 px-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition",
                            },
                            InputLabelProps: {
                              className: "text-zinc-700 dark:text-zinc-300",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  {/* Round Trip Option */}
                  <div className="flex items-center mt-4">
                    <Checkbox id="roundTrip" />
                    <Label
                      htmlFor="roundTrip"
                      className="ml-2 text-sm font-medium"
                    >
                      Round Trip
                    </Label>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Date */}
                    <div>
                      <Label
                        htmlFor="return-date"
                        className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        Return Date
                      </Label>
                      <DatePicker
                        // value={pickupDate}
                        // onChange={setPickupDate}
                        slotProps={{
                          textField: {
                            id: "return-date",
                            fullWidth: true,
                            placeholder: "MM/DD/YYYY",
                            InputProps: {
                              className:
                                "w-full h-10 px-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition",
                            },
                            InputLabelProps: {
                              className: "text-zinc-700 dark:text-zinc-300",
                            },
                          },
                        }}
                      />
                    </div>
                    {/* Pickup Time */}
                    <div>
                      <Label
                        htmlFor="return-time"
                        className="block text-sm sm:text-base font-semibold mb-1 tracking-wide"
                      >
                        Return Time
                      </Label>
                      <TimePicker
                        // value={pickupTime}
                        // onChange={setPickupTime}
                        slotProps={{
                          textField: {
                            id: "return-time",
                            fullWidth: true,
                            InputProps: {
                              className:
                                "w-full h-10 px-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition",
                            },
                            InputLabelProps: {
                              className: "text-zinc-700 dark:text-zinc-300",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </LocalizationProvider>
              </CardContent>
            </Card>

            {/* <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-zinc-700 mb-1 tracking-wide">
                  Pick Up Address
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter Pick Up Address"
                  className="w-full px-4 py-3 border border-zinc-800 text-zinc-800 rounded-lg bg-transparent  placeholder:text-zinc-600 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-zinc-700 mb-1 tracking-wide">
                  Drop Off Address
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  value={dropOffAddress}
                  onChange={(e) => setDropOffAddress(e.target.value)}
                  placeholder="Enter Drop Off Address"
                  className="w-full px-4 py-3 border border-zinc-800 text-zinc-800 rounded-lg bg-transparent  placeholder:text-zinc-600 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
              </div>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-md text-lg tracking-wide focus:outline-none"
            >
              {loading ? "Scheduling..." : "Schedule Ride"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
