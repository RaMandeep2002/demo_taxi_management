"use client";

import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../DashBoardLayout";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchSettings, selectSettings } from "../../slices/slice/settingSlics";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UpdateSettings } from "../../slices/slice/UpdateSettingSlice";
import { useToast } from "@/hooks/use-toast";
import { Settings2 } from "lucide-react";

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  const { settings, isLoading, error } = useSelector(selectSettings);
  const { isUpdating } = useSelector((state: RootState) => state.updateSetting);

  const [base_price, setBase_price] = useState<string>("");
  const [km_price, setKm_price] = useState<string>("");
  const [waiting_time_price_per_minutes, setWaitingTime] = useState<string>("");

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setBase_price(settings.base_price.toString());
      setKm_price(settings.km_price.toString());
      setWaitingTime(settings.waiting_time_price_per_minutes.toString());
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basePriceNum = parseFloat(base_price);
    const kmPriceNum = parseFloat(km_price);
    const waitingTimeNum = parseFloat(waiting_time_price_per_minutes);

    if (isNaN(basePriceNum) || isNaN(kmPriceNum) || isNaN(waitingTimeNum)) {
      toast.toast({ title: "Please enter valid numbers." });
      return;
    }

    try {
      await dispatch(
        UpdateSettings({
          base_price: basePriceNum,
          km_price: kmPriceNum,
          waiting_time_price_per_minutes: waitingTimeNum,
        })
      ).unwrap();

      toast.toast({ title: "Successfully updated the Prices" });
      dispatch(fetchSettings());
    } catch (error) {
      alert(`Failed to update. ${error}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold  flex items-center gap-2">
              <span>
                <Settings2 />
              </span>
              <span>Settings</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage system Settings.</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-white mb-4">
            {error}
          </div>
        )}

        {!isLoading  && (
          <form
            onSubmit={handleSubmit}
            className="shadow-lg rounded-lg p-6 max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-4">
              Update Ride Pricing
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              Adjust the pricing details for rides. These settings affect how fares are calculated for all users.
            </p>

            <div className="space-y-5">
              <div>
                <Label className="block text-zinc-800 dark:text-zinc-200 font-medium mb-1" htmlFor="base_price">
                  Base Price
                </Label>
                <Input
                  id="base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={base_price}
                  onChange={(e) => setBase_price(e.target.value)}
                  className="border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="Enter the base fare (e.g., 5.00)"
                  required
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  The minimum fare charged for any ride.
                </span>
              </div>

              <div>
                <Label className="block text-zinc-800 dark:text-zinc-200 font-medium mb-1" htmlFor="km_price">
                  Distance Price Per KM
                </Label>
                <Input
                  id="km_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={km_price}
                  onChange={(e) => setKm_price(e.target.value)}
                  className="border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="Enter price per kilometer (e.g., 1.25)"
                  required
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Additional fare charged for each kilometer traveled.
                </span>
              </div>

              <div>
                <Label className="block text-zinc-800 dark:text-zinc-200 font-medium mb-1" htmlFor="waiting_time_price_per_minutes">
                  Waiting Time Price Per Minute
                </Label>
                <Input
                  id="waiting_time_price_per_minutes"
                  type="number"
                  min="0"
                  step="0.01"
                  value={waiting_time_price_per_minutes}
                  onChange={(e) => setWaitingTime(e.target.value)}
                  className="border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="Enter waiting charge per minute (e.g., 0.50)"
                  required
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Fare charged for each minute the driver waits.
                </span>
              </div>

              <Button
                type="submit"
                disabled={isUpdating}
                className="mt-6 w-full rounded-md py-2 text-base font-semibold bg-black dark:bg-zinc-800 text-white hover:bg-zinc-800 dark:hover:bg-zinc-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update Pricing"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
  