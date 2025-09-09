"use client";
import { useState } from "react";
import DashboardLayout from "../../DashBoardLayout";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import { addUser } from "../../slices/slice/addUserSlice";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Lock, Shield, UserCheck } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";

export default function AddAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phone_number, setPhoneNumber] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, error, successMessage } = useSelector(
    (state: RootState) => state.addUser
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = dispatch(
      addUser({
        name,
        email,
        password,
        phone_number,
        role
      })
    );
    if (addUser.fulfilled.match(resultAction)) {
      setName("");
      setEmail("");
      setPassword("");
      // setRole("")
    }
  };

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
      <div className="w-full sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col items-center justify-center mt-8 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#BAFB5D] to-[#23272F] flex items-center justify-center shadow-lg mb-4">
            <UserCheck className="h-8 w-8 text-black dark:text-[#BAFB5D]" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Add New Admin
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 text-center max-w-xl">
            Create a new administrator account to manage your platform. Fill in the details below to get started.
          </p>
        </div>
        <div
          className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8 mt-6 sm:mt-12 rounded-md
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
          <Card className="shadow-lg border-0 bg-gradient-to-br   dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Basic details about the new administrator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">First Name</Label>
                    <Input
                      type="text"
                      name="name"
                      autoComplete="off"
                      placeholder="Enter First Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                           className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Last Name</Label>
                    <Input
                      type="text"
                      name="name"
                      autoComplete="off"
                      placeholder="Enter Last Name"
                      // value={name}
                      // onChange={(e) => setName(e.target.value)}
                      required
                           className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                     type="email"
                     name="email"
                     autoComplete="off"
                     placeholder="Enter the Email of Admin"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                       className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      placeholder="Enter phone number"
                      value={phone_number}
                      onChange={(value) => setPhoneNumber(value || "")}
                      className="PhoneInputInput w-full h-9 px-2 py-2 border dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

         <Card className="shadow-lg border-0 bg-gradient-to-br   dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role & Access Level
              </CardTitle>
              <CardDescription>Define the administrator&apos;s role and system access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Admin Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger   className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition">
                      <SelectValue placeholder="Select admin role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
                      <SelectItem value="driver-manager">Driver Manager</SelectItem>
                      <SelectItem value="schedule-support">Schedule Ride Support</SelectItem>
                      <SelectItem value="system-admin">System Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                {/* <div className="space-y-2">
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select>
                    <SelectTrigger   className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="limited">Limited Access</SelectItem>
                      <SelectItem value="read-only">Read Only</SelectItem>
                      <SelectItem value="custom">Custom Permissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              {/* </div> */}

              {/* <div className="space-y-2">
                <Label htmlFor="description">Role Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the admin's responsibilities and access scope..."
                  rows={3}
                />
              </div> */}
            </CardContent>
          </Card>


          <Card className="mt-4 shadow-lg border-0 bg-gradient-to-br   dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock />
                  <span>Password</span>
                </CardTitle>
                <CardDescription>
                  Set a secure password for the driver. You can generate a strong password or show/hide the password for convenience.
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
                     required
                    className="border  dark:border-gray-300 text-zinc-800 dark:text-white rounded-lg bg-transparent  placeholder:text-zinc-600 dark:placeholder:text-gray-300 text-base focus:outline-none transition"
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
                  Password must be at least 8 characters and contain a mix of letters and numbers.
                </p>
              </CardContent>
            </Card>

            
            <Card className="mt-4 shadow-lg border-0 bg-gradient-to-br   dark:from-[#34363F] dark:via-[#34363F] dark:to-[#34363F] transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="text-lg font-semibold">Admin Registration Details</span>
                  </CardTitle>
                  <CardDescription>
                    <span className="text-zinc-600 dark:text-zinc-300">
                      Please review and submit the admin registration details above.
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                      className="px-8 py-4 font-bold text-lg bg-black text-white dark:bg-[#BAFB5D] dark:text-black rounded-full transition-colors shadow tracking-wide hover:bg-gray-900 dark:hover:bg-[#BAFB5D] flex items-center gap-3 duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        {isLoading ? "Adding..." : "Add Admin"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            

            {/* <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md py-2 sm:py-3 text-base sm:text-lg font-semibold transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add Admin"}
            </Button> */}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
