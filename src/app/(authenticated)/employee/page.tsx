"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { getEmployeeAction } from "@/app/Services/supabase.actions";
import useApi from "@/Hooks/use-api";
import useSupabase from "@/Hooks/use-supabase";
import { Database, Tables } from "../../../../database.types";
import { createClient } from "../../../../utils/supabase/client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EmployeeForm from "@/components/EmployeeForm";
import { employeeSchema } from "@/schma/employee.schema";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const mockJobs = [
  { id: "job-1", title: "Downtown Office Project" },
  { id: "job-2", title: "Construction Site A" },
  { id: "job-3", title: "Warehouse Operations" },
  { id: "job-4", title: "Remote Development" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];
type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function page() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Tables<"employees">[] | []>([]);
  const [jobList, setJobList] = useState<{ id: string; name: string }[]>([]);
  const [paginatedEmployees, setPaginatedEmployees] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      position: "",
      employment_type: "",
      status: "",
      payrate: "",
      start_date: "",
      notes: "",
      job: "",
    },
  });

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    if (!term) {
      //   setFilteredEmployees(employees);
    } else {
      //   const filtered = employees.filter(
      //     employee =>
      //       employee.name.toLowerCase().includes(term.toLowerCase()) ||
      //       employee.email.toLowerCase().includes(term.toLowerCase()) ||
      //       employee.phone.includes(term) ||
      //       employee.position.toLowerCase().includes(term.toLowerCase()) ||
      //       employee.employment_type.toLowerCase().includes(term.toLowerCase()) ||
      //       employee.employee_id.toString().includes(term)
      //   );
      //   setFilteredEmployees(filtered);
    }
  };

  const handleStatusChange = (employeeId: string, newStatus: string) => {
    try {
      //   const updatedEmployees = employees.map(employee =>
      //     employee.id === employeeId
      //       ? { ...employee, status: newStatus }
      //       : employee
      //   );
      //   setEmployees(updatedEmployees);

      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        // setFilteredEmployees(updatedEmployees);
      }

      //   const employee = employees.find(e => e.id === employeeId);
      //   toast.success(
      //     `${employee?.name}'s status has been changed to ${getStatusLabel(
      //       newStatus
      //     )}.`
      //   );
    } catch (error) {
      toast.error("Failed to update employee status. Please try again.");
    }
  };
  const { getFetch, updateTable } = useSupabase();

  const handleSubmitForm = async (data: EmployeeFormValues) => {
    try {
      const response = await updateTable(
        "employees",
        "id",
        editingEmployee?.id,
        data
      );
      if (response.data) {
        // Update the employees state with the updated employee
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === editingEmployee.id ? response.data[0] : emp
          )
        );
        setIsDialogOpen(false);
        setEditingEmployee(null);
      }
    } catch (error) {}
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
    form.setValue("phone", employee.phone || "");
  };

  const handleDelete = async (employee: any) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("employees")
        .delete()
        .eq("id", employee.id);
      if (data) {
        const updatedEmployees = employees.filter(e => e.id !== employee.id);
        console.log(updatedEmployees, "mfer");
        setEmployees(updatedEmployees);
      }
      if (error) {
      }

      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        // setFilteredEmployees(updatedEmployees);
      }

      toast.success(`${employee.name} has been removed from the system.`);
    } catch (error) {
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "AWAITINGVERIFICATION":
        return "secondary";
      case "INACTIVE":
        return "outline";
      case "TERMINATED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "AWAITINGVERIFICATION":
        return "Awaiting Verification";
      case "ACTIVE":
        return "Active";
      case "INACTIVE":
        return "Inactive";
      case "TERMINATED":
        return "Terminated";
      default:
        return status;
    }
  };

  const getJobTitle = (jobId: string | null) => {
    if (!jobId) return "No Job Assigned";
    const job = mockJobs.find(j => j.id === jobId);
    return job ? job.title : "No jobs Assigned";
  };

  const getJobsApi = async () => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from("jobs").select("id,name");
      if (data) {
        setJobList(data);
      }
      if (error) {
        setJobList([]);
      }
    } catch (error) {
      console.error("Error occured at getJobsApi", error);
    }
  };

  // Generate page numbers for pagination
  //   const getPageNumbers = () => {
  //     const pages = [];
  //     const maxVisiblePages = 5;

  //     if (totalPages <= maxVisiblePages) {
  //       for (let i = 1; i <= totalPages; i++) {
  //         pages.push(i);
  //       }
  //     } else {
  //       if (currentPage <= 3) {
  //         for (let i = 1; i <= 4; i++) {
  //           pages.push(i);
  //         }
  //         pages.push("...");
  //         pages.push(totalPages);
  //       } else if (currentPage >= totalPages - 2) {
  //         pages.push(1);
  //         pages.push("...");
  //         for (let i = totalPages - 3; i <= totalPages; i++) {
  //           pages.push(i);
  //         }
  //       } else {
  //         pages.push(1);
  //         pages.push("...");
  //         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
  //           pages.push(i);
  //         }
  //         pages.push("...");
  //         pages.push(totalPages);
  //       }
  //     }

  //     return pages;
  //   };

  //   const startIndex = (currentPage - 1) * itemsPerPage + 1;
  //   const endIndex = Math.min(
  //     currentPage * itemsPerPage,
  //     filteredEmployees.length
  //   );

  const fetchEmployees = () =>
    getFetch("employees", currentPage, itemsPerPage, {
      ...(searchTerm ? { name: searchTerm } : {}),
      ...(statusFilter && statusFilter !== "ALL"
        ? { status: statusFilter }
        : {}),
    });
  const { loading, error, data, count } = useApi("employees", fetchEmployees, [
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
  ]);
  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);
  useEffect(() => {
    getJobsApi();
  }, []);

  // Refetch when pagination changes
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getFetch("employees", currentPage, itemsPerPage);
  //     if (response.success && response.data) {
  //       setEmployees(response.data);
  //     }
  //   };
  //   fetchData();
  // }, [currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage employee profiles, positions, and employment details
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Edit" : "Add"} Employee
              </DialogTitle>
              <DialogDescription>
                {editingEmployee
                  ? "Update the employee information."
                  : "Add a new employee to your organization."}
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm
              handleSubmitForm={handleSubmitForm}
              editingEmployee={editingEmployee}
              form={form}
              jobsList={jobList}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, position, or ID..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing {employees.length} of {employees.length} employees
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">All employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(e => e.status === "ACTIVE").length}
            </div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>
                View and manage all employee information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">
                Show:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label htmlFor="status-filter" className="text-sm ml-4">
                Status:
              </Label>
              <Select
                value={statusFilter}
                onValueChange={value => setStatusFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="AWAITINGVERIFICATION">
                    Awaiting Verification
                  </SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Pay Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-mono text-sm">
                      {employee.employee_id}
                    </TableCell>

                    <TableCell>
                      <div
                        onClick={() => router.push(`employee/${employee.id}`)}
                      >
                        <div className="font-medium">{employee.name}</div>
                        {employee.email && (
                          <div className="text-sm text-muted-foreground">
                            {employee.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.position}</div>
                        <div className="text-sm text-muted-foreground">
                          {getJobTitle(employee.job)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {employee.employment_type ? (
                        <Badge variant="outline">
                          {employee.employment_type}
                        </Badge>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No employment type
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {employee.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={`tel:${employee.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {employee.phone}
                            </a>
                          </div>
                        )}
                        {employee.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={`mailto:${employee.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              Email
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {(employee.payrate ?? 0).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /hr
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={employee.status ?? ""}
                        onValueChange={value =>
                          handleStatusChange(employee.id, value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue>
                            <Badge
                              variant={getStatusBadgeVariant(
                                employee.status ?? ""
                              )}
                            >
                              {getStatusLabel(employee.status ?? "")}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AWAITINGVERIFICATION">
                            Awaiting Verification
                          </SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="TERMINATED">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {employee.start_date ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(employee.start_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employee)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    {searchTerm
                      ? "No employees found matching your search."
                      : "No employees found. Add your first employee to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {/* {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex} to {endIndex} of {filteredEmployees.length}{" "}
                employees
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
