"use client";
import React, { useEffect } from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Search,
  Users,
  Timer,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit,
  X,
} from "lucide-react";
import { createClient } from "../../../../utils/supabase/client";
import { Employee } from "@/types/types";
import { getJobNameById, getMonday } from "@/lib/utils";
import { DatePicker } from "@/components/ui/datepicker";
import useUserStore from "@/store";
import { toast } from "sonner";
import ExportButton from "@/components/payroll/export";

export default function Payroll() {
  const { jobs } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [payroll, setPayroll] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Pagination calculations
  const totalPages = Math.ceil(payroll.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    if (value === "ALL") {
      setStatusFilter("");
    } else {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value));
    setCurrentPage(1);
  };

  // Ensure current page doesn't exceed total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // Calculate summary statistics
  // const totalEmployees = employees.length;
  const totalHours = payroll.reduce((sum, emp) => sum + emp.total_hours, 0);
  const averageHours = totalHours / 10;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      formatted: date.toLocaleDateString(),
      day: days[date.getDay()],
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Active</Badge>;
      case "INACTIVE":
        return <Badge variant="outline">Inactive</Badge>;
      case "TERMINATED":
        return <Badge variant="destructive">Terminated</Badge>;
      case "AWAITINGVERIFICATION":
        return <Badge variant="secondary">Awaiting Verification</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getEmployeeTimesheets = async () => {
    const supabase = createClient();
    const response = await supabase.rpc("get_employees_with_timesheets", {
      search_name: searchTerm,
      emp_status: "",
      page_limit: 10,
      page_number: currentPage,
      week_start_date: getMonday(
        (selectedDate ? selectedDate : new Date()).toISOString()
      ),
    });
    if (response.data) {
      setPayroll(response.data.data);
      setTotalEmployees(response.data.total);
    } else {
      setPayroll([]);
      setTotalEmployees(0);
    }
  };

  useEffect(() => {
    getEmployeeTimesheets();
  }, [searchTerm, currentPage, selectedDate]);

  const handleApproveTimesheet = async (status: boolean, id: string) => {
    try {
      const supabase = createClient();
      const response = await supabase
        .from("timesheets")
        .update([{ approved: status }])
        .eq("id", id)
        .select();

      if (response.data && response.data.length > 0) {
        const updatedTimesheet = response.data[0];
        setPayroll(prevPayroll =>
          prevPayroll.map(employee => ({
            ...employee,
            timesheets: (employee.timesheets || []).map(ts =>
              ts.id === updatedTimesheet.id ? { ...ts, approved: status } : ts
            ),
          }))
        );
        toast.success(status ? "Timesheet approved!" : "Timesheet unapproved!");
      } else {
        toast.error("Failed to update timesheet approval status.");
      }
    } catch (error) {
      toast.error("Failed to update timesheet approval status.");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {totalEmployees} active employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Employees
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {(((totalEmployees ?? 0) / 10) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Across all employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Per employee</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Timesheets</CardTitle>
          <CardDescription>
            View and manage all employee timesheet records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
                <SelectItem value="AWAITINGVERIFICATION">
                  Awaiting Verification
                </SelectItem>
              </SelectContent>
            </Select>
            <DatePicker
              date={selectedDate}
              setDate={date => setSelectedDate(date ?? new Date())}
            />
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>

            <ExportButton />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, totalEmployees ?? 0)} of {totalEmployees ?? 0}{" "}
              employees
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {payroll.map(employee => (
              <AccordionItem key={employee.id} value={employee.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-left">
                        <div className="font-semibold text-lg capitalize">
                          {employee.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.position}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">
                          {employee.total_hours}h
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Hours
                        </div>
                        <div className="flex justify-center items-center">
                          {getStatusBadge(employee.status ?? "UNKNOWN")}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <div className="grid gap-4">
                      {(employee?.timesheets ?? []).length > 0 ? (
                        (employee?.timesheets ?? []).map(timesheet => {
                          const dateInfo = formatDate(timesheet.date);
                          return (
                            <Card
                              key={timesheet.id}
                              className={
                                `border-l-4 ` +
                                (timesheet.approved === true
                                  ? "border-l-green-500"
                                  : timesheet.approved === false
                                  ? "border-l-red-500"
                                  : "border-l-blue-500")
                              }
                            >
                              <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <div className="font-medium">
                                          {dateInfo.formatted}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {dateInfo.day}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <div className="font-medium">
                                          {timesheet.start_time} -{" "}
                                          {timesheet.end_time}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {timesheet.total_hours}h total
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <div className="font-medium">
                                          {getJobNameById(
                                            jobs,
                                            timesheet.job_site
                                          )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          Job Site
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Badge
                                        variant={
                                          timesheet.is_locked
                                            ? "secondary"
                                            : "outline"
                                        }
                                      >
                                        {timesheet.is_locked
                                          ? "Locked"
                                          : "Unlocked"}
                                      </Badge>
                                      <Badge
                                        variant={
                                          timesheet.approved
                                            ? "default"
                                            : "destructive"
                                        }
                                      >
                                        {timesheet.approved
                                          ? "Approved"
                                          : "Un-Approved"}
                                      </Badge>
                                      <div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => console.log(timesheet)}
                                          className="h-8 w-8 sm:h-9 sm:w-9"
                                        >
                                          <Edit className="h-2 w-2 md:h-4 md:w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleApproveTimesheet(
                                              !timesheet.approved,
                                              timesheet.id
                                            )
                                          }
                                          className="h-8 w-8 sm:h-9 sm:w-9"
                                        >
                                          {timesheet.approved ? (
                                            <X
                                              className="h-2 w-2 md:h-4 md:w-4"
                                              color="red"
                                            />
                                          ) : (
                                            <Check
                                              className="h-2 w-2 md:h-4 md:w-4"
                                              color="green"
                                            />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No timesheet records found for this employee.
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {payroll.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No employees found matching your search criteria.
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-sm text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page as number)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
