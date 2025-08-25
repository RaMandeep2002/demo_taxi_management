"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loginAdmin } from "../slices/slice/authSlice";
import { AppDispatch, RootState } from "@/app/store/store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();
  const { token, isLoading, role } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("token ===> ", token)
    console.log("role ===> ", role)
    if (
      token &&
      (role === "admin" || role === "fleet-manger" || role === "super-admin")
    ) {
      toast({
        title: "Already Logged In",
        description: "Redirecting to dashboard...",
      });
      router.push("/admin/dashboard");
    } 
  }, [token, role, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginAdmin({ email, password })).unwrap();
      console.log("result ====> ", result)

      if (result.role === "admin" || result.role == "super-admin" || result.role == "fleet-manager") {
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
        });
        router.push("/admin/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: (
            <span style={{ color: "#991b1b" }}>
              Only <span style={{ fontWeight: "bold" }}>admins</span> can access this portal.
            </span>
          ),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: `Invalid email or password. ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`
        min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 
        bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900
        bg-cover bg-center transition-colors  
      `}
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/JnTcbvg9/bg-1.png')",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[450px]">
        <Card className="w-full shadow-2xl border-0 dark:border-0 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md transition-colors">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2 shadow-md">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600 dark:text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <CardTitle className="text-zinc-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Admin Login
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-300 text-center">
              Welcome back! Please enter your admin credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="grid w-full items-center gap-7">
                {/* Email Field */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email" className="text-zinc-800 dark:text-zinc-200 font-semibold text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="h-12 px-4 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                {/* Password Field */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="password" className="text-zinc-800 dark:text-zinc-200 font-semibold text-base">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 px-4 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
              {/* Submit Button */}
              <CardFooter className="flex flex-col gap-3 justify-end mt-8 px-0">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 font-semibold text-lg py-3 rounded-lg shadow-md transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  <span className="opacity-80">Forgot your password?</span>
                  <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline transition">Contact Super Admin</span>
                </div>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        <div className="mt-8 text-center text-zinc-500 dark:text-zinc-400 text-xs">
          &copy; {new Date().getFullYear()} Demo Taxi Admin Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
}
