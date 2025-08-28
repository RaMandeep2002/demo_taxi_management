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
import { Moon, Settings2, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { setTheme } = useTheme();
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
      <div className="p-4 sm:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Settings2 className="w-7 h-7" />
              <span>Settings</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
              Manage system settings and preferences.
            </p>
          </div>
        </div>

        <div>
          <Tabs defaultValue="priceSetting">
            <TabsList className="gap-5 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg mb-6 shadow-sm">
              <TabsTrigger
                value="priceSetting"
                className="px-5 py-2 rounded-md font-medium text-zinc-700 dark:text-zinc-200 transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow"
              >
                Price Settings
              </TabsTrigger>
            
              <TabsTrigger
                value="emailsetting"
                className="px-5 py-2 rounded-md font-medium text-zinc-700 dark:text-zinc-200 transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow"
              >
                Email Settings
              </TabsTrigger>
              <TabsTrigger
                value="themeSetting"
                className="px-5 py-2 rounded-md font-medium text-zinc-700 dark:text-zinc-200 transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow"
              >
                Theme Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="priceSetting">
              <div className="max-w-2xl w-full mt-5">
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-zinc-900/70 z-10 rounded-xl">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmit}
                    className="shadow-lg border border-gray-200 dark:border-zinc-700 p-8 rounded-xl bg-white dark:bg-zinc-900 transition mb-10 relative"
                    style={{
                      opacity: isLoading ? 0.5 : 1,
                      pointerEvents: isLoading ? "none" : "auto",
                    }}
                  >
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                      <span className="inline-block bg-zinc-100 dark:bg-zinc-800 rounded-full p-2">
                        <Settings2 className="w-6 h-6" />
                      </span>
                      Update Ride Pricing
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                      Adjust the pricing details for rides. These settings
                      affect how fares are calculated for all users.
                    </p>

                    {error && (
                      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-center">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2"
                          htmlFor="base_price"
                        >
                          Base Price
                        </Label>
                        <Input
                          id="base_price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={base_price}
                          onChange={(e) => setBase_price(e.target.value)}
                          className="border border-gray-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                          placeholder="Enter the base fare (e.g., 5.00)"
                          required
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                          The minimum fare charged for any ride.
                        </span>
                      </div>

                      <div>
                        <Label
                          className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2"
                          htmlFor="km_price"
                        >
                          Distance Price Per KM
                        </Label>
                        <Input
                          id="km_price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={km_price}
                          onChange={(e) => setKm_price(e.target.value)}
                          className="border border-gray-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                          placeholder="Enter price per kilometer (e.g., 1.25)"
                          required
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                          Additional fare charged for each kilometer traveled.
                        </span>
                      </div>

                      <div className="md:col-span-2">
                        <Label
                          className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2"
                          htmlFor="waiting_time_price_per_minutes"
                        >
                          Waiting Time Price Per Minute
                        </Label>
                        <Input
                          id="waiting_time_price_per_minutes"
                          type="number"
                          min="0"
                          step="0.01"
                          value={waiting_time_price_per_minutes}
                          onChange={(e) => setWaitingTime(e.target.value)}
                          className="border border-gray-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                          placeholder="Enter waiting charge per minute (e.g., 0.50)"
                          required
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                          Fare charged for each minute the driver waits.
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="mt-10 w-full rounded-lg py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-fuchsia-800 dark:hover:bg-fuchsia-900 text-white transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow"
                    >
                      {isUpdating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Updating...
                        </span>
                      ) : (
                        "Update Pricing"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="emailsetting">
              <div className="max-w-2xl w-full mt-5">
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 p-8">
                  <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
                    {/* <span className="inline-block bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 text-xs font-bold mr-2">Email</span> */}
                    Email Settings
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
                    Configure the email address used for admin notifications and ride booking alerts.
                  </p>
                  <form className="space-y-6">
                    <div>
                      <Label
                        htmlFor="admin_email"
                        className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2"
                      >
                        Admin Email Address
                      </Label>
                      <Input
                        id="admin_email"
                        type="email"
                        className="border border-gray-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                        placeholder="Enter admin email (e.g., admin@example.com)"
                        required
                        // value and onChange should be connected to state in a real implementation
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                        This email will receive all ride booking notifications.
                      </span>
                    </div>
                    <div>
                      <Label
                        htmlFor="app_password"
                        className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2"
                      >
                        App Password
                      </Label>
                      <Input
                        id="app_password"
                        type="password"
                        className="border border-gray-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                        placeholder="Enter App Password"
                        required
                        // value and onChange should be connected to state in a real implementation
                      />
                      {/* <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                        This email will receive all ride booking notifications.
                      </span> */}
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 w-full rounded-lg py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-fuchsia-800 dark:hover:bg-fuchsia-900 text-white transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow"
                      // disabled={isUpdatingEmail}
                    >
                      {/* {isUpdatingEmail ? "Updating..." : "Update Email"} */}
                      Update Email
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="themeSetting">
            <div className="max-w-2xl w-full mt-5">
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 p-8">
                  <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
                    <Settings2 className="w-5 h-5" /> Theme Settings
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
                    Choose your preferred appearance for the dashboard. You can
                    switch between Light, Dark, or System theme.
                  </p>
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-300 bg-transparent dark:bg-transparent hover:bg-gray-100 dark:hover:bg-fuchsia-950 transition-colors shadow"
                        >
                          <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          <span className="sr-only">Toggle theme</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          Dark
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => setTheme("system")}>
                          System
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Current:{" "}
                      <span className="font-semibold capitalize">
                        {(() => {
                          if (typeof window === "undefined") return "Light";
                          const theme = localStorage.getItem("theme");
                          if (theme === "dark") return "Dark";
                          if (theme === "light") return "Light";
                          // fallback to system
                          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
                        })()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
