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
    if (token && role === "admin") {
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

      if (result.role === "admin") {
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
        });
        router.push("/admin/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "Only admins can access this portal.",
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
        bg-cover bg-center transition-colors
        bg-white dark:bg-zinc-900
      `}
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/JnTcbvg9/bg-1.png')",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[450px]">
        <Card className="w-full shadow-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition-colors">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white text-2xl font-bold">
              Admin Login
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-300">
              Please enter your admin credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="grid w-full items-center gap-6">
                {/* Email Field */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email" className="text-zinc-800 dark:text-zinc-200 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 px-3 rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                {/* Password Field */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="password" className="text-zinc-800 dark:text-zinc-200 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 px-3 rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              {/* Submit Button */}
              <CardFooter className="flex justify-end mt-6 px-0">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
