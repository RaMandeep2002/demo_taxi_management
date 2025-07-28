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
  AlertDialogFooter,
  AlertDialogHeader,
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
      <div className="p-8">
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
              className="w-full sm:w-auto"
              onClick={() => router.push("/admin/dashboard/AddAdmin")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Register Admin
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Card className="lg:col-span-2">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Admin Name</TableHead>
                    <TableHead>Admin Email</TableHead>
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
            </CardContent>
          </Card>
        </div>

        <Dialog
          open={dialogType === "profile"}
          onOpenChange={handleDialogClose}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Admin Profile</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedAdmin?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-base">
                        {selectedAdmin.name
                          ? selectedAdmin.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "A"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedAdmin.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedAdmin._id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Email
                      </Label>
                      <p className="text-sm">{selectedAdmin.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* You can add more admin details here if needed */}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={dialogType === "edit"} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
            <DialogHeader className="space-y-3 pb-6 border-b border-slate-100">
              <DialogTitle className="text-slate-800 dark:text-white text-2xl font-bold flex items-center gap-3">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow">
                    <span className="text-blue-600 font-bold text-xl">
                      {selectedAdmin?.name
                        ? selectedAdmin?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "A"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                      Update Data for
                    </h3>
                    <span className="block text-base font-medium text-blue-700 dark:text-yellow-300">
                      {selectedAdmin?.name}
                    </span>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            {iserror && <p className="text-red-500 text-center">{iserror}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-slate-700 dark:text-white font-medium flex items-center gap-2"
                  >
                    Admin Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter Driver Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-white font-medium flex items-center gap-2"
                  >
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                {/* <h1 className="text-zinc-800">
                                <span className="bg-yellow-200 px-2 py-1 rounded text-zinc-900">
                                  Update Password for <span className="font-bold">{admin.name}</span>
                                </span>
                              </h1> */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                  className="text-slate-700 dark:text-white font-medium flex items-center gap-2"
                  >
                    Password
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Updated Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-zinc-600 hover:text-zinc-800"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Updating..." : "Update Admin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={dialogType === "delete"}
          onOpenChange={handleDialogClose}
        >
          <AlertDialogContent className="border-none">
          <AlertDialogHeader className="space-y-3 pb-6">
              <AlertDialogTitle className="flex items-center gap-4 text-slate-800 text-2xl font-bold">
                <div className="flex items-center gap-4 mb-4">
                  {/* Admin Initials Avatar */}
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow">
                    <span className="text-blue-600 font-bold text-xl">
                      {selectedAdmin?.name
                        ? selectedAdmin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "A"}
                    </span>
                  </div>
                  {/* Delete Confirmation Text */}
                  <div>
                    <h3 className="text-lg font-bold text-red-600">
                      Confirm Admin Deletion
                    </h3>
                    <p className="text-sm text-zinc-700 mt-1">
                      You are about to permanently delete the following admin account:
                    </p>
                    <span className="block text-base font-semibold text-blue-700 dark:text-yellow-300">
                      {selectedAdmin?.name || "Unknown Admin"}
                    </span>
                  </div>
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={
                  selectedAdmin?._id
                    ? handleAdminDriver(selectedAdmin?._id)
                    : undefined
                }
                disabled={isDeleteting}
              >
                {isDeleteting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
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
