"use client";
import { Input } from "@/components/ui/input";
import DashboardLayout from "../../DashBoardLayout";
import { Button } from "@/components/ui/button";
// import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { useDebounce } from "@/lib/useDebounce";
import {
  Admins,
  fetchAdminsdetails,
} from "../../slices/slice/fetchingAdminSlice";
import { useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { updateAdmin } from "../../slices/slice/updateUserSlice";
import { useToast } from "@/hooks/use-toast";
import { deleteAdmin } from "../../slices/slice/deleteAdminSlice";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function AdminList() {
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);
  const [dialogType, setDialogType] = useState<
    "profile" | "edit" | "delete" | null
  >(null);

  const [selectedAdmin, setSelectedAdmin] = useState<Admins | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data: admins,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.adminFetching);
  const { isProcessing, iserror } = useSelector(
    (state: RootState) => state.updateAdmin
  );
  const { isDeleteting, succeesMessage } = useSelector(
    (state: RootState) => state.deleteAdmins
  );

  const handleDialogOpen = (
    admin: Admins,
    type: "profile" | "edit" | "delete"
  ) => {
    setSelectedAdmin(admin);
    setDialogType(type);
  };

  const handleDialogClose = () => {
    setSelectedAdmin(null);
    setDialogType(null);
  };

  //   const [showPassword, setShowPassword] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(fetchAdminsdetails());
  }, [dispatch]);

  const filteredAdmins =
    admins?.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        admin.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesSearch;
    }) || [];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (selectedAdmin) {
      setFormData({
        name: selectedAdmin.name,
        email: selectedAdmin.email,
        password: "",
      });
    }
  }, [selectedAdmin]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedAdmin) {
      return;
    }

    try {
      await dispatch(
        updateAdmin({
          userId: selectedAdmin._id,
          userData: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
        })
      ).unwrap();

      if (!iserror) {
        toast.toast({
          title: "Admin Updated Successfully",
        });
        dispatch(fetchAdminsdetails());
      }
    } catch (error) {
      toast.toast({
        title: "Error",
        description: `Failed to update driver: ${error}`,
        variant: "destructive",
      });
    }
  };

  const handleAdminDriver = (userId: string) => async () => {
    try {
      await dispatch(deleteAdmin(userId));
      if (!isDeleteting) {
        toast.toast({
          title: "Admin Deleted",
          description: succeesMessage,
        });
        dispatch(fetchAdminsdetails());
      }
    } catch (error) {
      toast.toast({
        title: "Error",
        description: `Failed to delete driver: ${error}`,
        variant: "destructive",
      });
    }
  };
  return (
    <DashboardLayout>
     <div className="w-full px-2 pt-4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span>
                <List />
              </span>
              <span>Admin Management</span>
            </h1>
            <p className="text-gray-600 dark:text-white mt-1">Manage system administrators.</p>
          </div>
          <div className="w-full sm:w-auto flex justify-end mt-4 sm:mt-0">
            <Button
              className="redirect-button"
              onClick={() => router.push("/admin/dashboard/AddAdmin")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Register Admin
            </Button>
          </div>
        </div>

        <div>
        <Card className="list-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>System Administrators</CardTitle>
                  <CardDescription>
                    Manage admin users and their access levels
                  </CardDescription>
                </div>
                <div className="relative">
                  {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
                  <Input
                    placeholder="Search by name, email..."
                    className="w-full sm:w-52 border placeholder-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
            <div className="hidden sm:block">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Admin Name</TableHead>
                    <TableHead>Admin Email</TableHead>
                    <TableHead>Admin Role</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-black dark:text-white">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAdmins.map((admin) => (
                      <TableRow key={admin._id}>
                          <TableCell>
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-base">
                              {admin.name
                                ? admin.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {highlightMatch(admin.name, debouncedSearch)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {highlightMatch(admin.email, debouncedSearch)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {admin.role ? (
                              <span
                            className="font-medium text-gray-900 dark:text-white"
                              >
                                {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDialogOpen(admin, "profile")
                                }
                              >
                                <Eye className="w-4 h-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDialogOpen(admin, "edit")}
                              >
                                <Pencil className="w-4 h-4" />
                                Update Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDialogOpen(admin, "delete")
                                }
                              >
                                <Trash className="w-4 h-4" />
                                Delete Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="block sm:hidden">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                {error}
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No admins found
              </div>
            ) : (
              <Accordion type="single" collapsible>
                {[...paginatedAdmins]
                  .sort((a, b) => {
                    // Show "super admin" first
                    if (a.role === "super-admin" && b.role !== "super-admin") return -1;
                    if (a.role !== "super-admin" && b.role === "super-admin") return 1;
                    return 0;
                  })
                  .map((admin) => (
                  <AccordionItem key={admin._id} value={admin._id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-base">
                            {admin.name
                              ? admin.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "A"}
                          </span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-gray-900 dark:text-gray-200 truncate">
                            {admin.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {(admin._id)?.slice(0, 8)}
                          </span>
                        </div>
                        <div className="mr-2">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">
                            {admin.role
                              ? admin.role.charAt(0).toUpperCase() + admin.role.slice(1)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 space-y-2">
                        <div>
                          <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Name
                          </Label>
                          <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                            {admin.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Email
                          </Label>
                          <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                            {admin.email}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Role
                          </Label>
                          <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                            {admin.role
                              ? admin.role.charAt(0).toUpperCase() + admin.role.slice(1)
                              : "N/A"}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDialogOpen(admin, "profile")}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDialogOpen(admin, "edit")}
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDialogOpen(admin, "delete")}
                          >
                            <Trash className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={dialogType === "profile"} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-2xl bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-2xl border-0 p-0 rounded-3xl overflow-hidden">
            <DialogHeader className="bg-blue-600 dark:bg-blue-900 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-blue-900">
                  <span className="text-blue-700 dark:text-blue-200 font-extrabold text-2xl">
                    {selectedAdmin?.name
                      ? selectedAdmin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "A"}
                  </span>
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                    {selectedAdmin?.name || "Admin Profile"}
                  </DialogTitle>
                  <DialogDescription className="text-blue-100 mt-1">
                    Detailed information about {selectedAdmin?.name}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            {selectedAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-8 bg-white dark:bg-slate-900">
                {/* Left: Admin Info */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Name
                    </Label>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                      {selectedAdmin.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Email
                    </Label>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                      {selectedAdmin.email}
                    </p>
                  </div>
                  {/* <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Admin ID
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {selectedAdmin._id}
                    </p>
                  </div> */}
                </div>
                {/* Right: Placeholder for more admin details */}
                <div className="space-y-6">
                  {/* Add more admin details here if needed */}
                </div>
              </div>
            )}
            <DialogFooter className="bg-blue-50 dark:bg-slate-800 px-8 py-4 rounded-b-2xl flex justify-end">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-700 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-200 dark:hover:bg-blue-900"
                onClick={handleDialogClose}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={dialogType === "edit"} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[520px] border-0 shadow-2xl bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-0 overflow-hidden">
            <DialogHeader className="space-y-0 pb-0">
              <div className="flex flex-col items-center justify-center bg-blue-600 dark:bg-blue-900 py-6 px-8 shadow-inner">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-blue-700 mb-2">
                  <span className="text-blue-700 dark:text-blue-200 font-extrabold text-2xl tracking-widest">
                    {selectedAdmin?.name
                      ? selectedAdmin?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "A"}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  {selectedAdmin?.name
                    ? selectedAdmin.name.charAt(0).toUpperCase() + selectedAdmin.name.slice(1)
                    : "Admin Profile"}
                </DialogTitle>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Update Admin Information
                </h3>
              </div>
            </DialogHeader>
            <div className="px-8 py-6">
              {iserror && (
                <div className="mb-4">
                  <p className="text-red-500 text-center font-semibold bg-red-50 dark:bg-red-900 rounded py-2">
                    {iserror}
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                    >
                      Admin Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter Admin Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="h-11 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 dark:text-white font-semibold flex items-center gap-2"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Updated Password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                        className="h-11 pr-10 rounded-lg border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-white"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg tracking-wide shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Update Admin"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={dialogType === "delete"} onOpenChange={handleDialogClose}>
          <AlertDialogContent className="border-none p-0 overflow-hidden rounded-2xl shadow-2xl max-w-lg">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 dark:from-red-900 dark:via-yellow-800 dark:to-yellow-600 px-8 py-6 flex flex-col items-center">
              <div className="bg-white dark:bg-slate-900 rounded-full p-3 shadow-lg mb-3 border-4 border-red-200 dark:border-yellow-700">
                <svg className="w-10 h-10 text-red-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-30"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-white mb-1">Delete Admin?</AlertDialogTitle>
              <AlertDialogDescription className="text-white text-base text-center font-medium">
                Are you sure you want to <span className="font-bold text-yellow-200">permanently delete</span> the admin account for <br />
                <span className="font-bold text-white bg-red-700/70 px-2 py-1 rounded">{selectedAdmin?.name || "this admin"}</span>?
                <br />
                <span className="text-sm text-yellow-100 font-normal">This action cannot be undone.</span>
              </AlertDialogDescription>
            </div>
            <div className="bg-white dark:bg-slate-900 px-8 py-6 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
              <AlertDialogCancel className="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={
                  selectedAdmin?._id
                    ? () => handleAdminDriver(selectedAdmin._id)
                    : undefined
                }
                disabled={isDeleteting}
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold shadow hover:from-red-700 hover:to-yellow-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-1 -ml-1 inline-block" fill="none" viewBox="0 0 24 24">
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {isDeleteting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 sm:gap-0">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="text-black bg-white hover:bg-gray-100 hover:text-black w-full sm:w-auto border border-gray-300"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="text-black bg-white hover:bg-gray-100 hover:text-black w-full sm:w-auto border border-gray-300"
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

const highlightMatch = (text: string, term: string) => {
  const regex = new RegExp(`(${term})`, "gi");
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text.replace(regex, `<mark class="bg-yellow-300">$1</mark>`),
      }}
    />
  );
};
