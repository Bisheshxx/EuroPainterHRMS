"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Receipt,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "../../../../../utils/supabase/client";
import { Tables } from "../../../../../database.types";
import MaterialExpenses from "./MaterialExpenses";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type Job = Tables<"jobs"> & {
  customer_details?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
};

type Timesheet = Tables<"timesheets"> & {
  employee_details?: {
    id: string;
    name: string | null;
    position: string | null;
  } | null;
};

const statusColors = {
  Planning: "secondary",
  "In Progress": "default",
  "On Hold": "outline",
  Completed: "secondary",
  Cancelled: "destructive",
} as const;

const invoiceStatusColors = {
  "Not Invoiced": "secondary",
  Pending: "outline",
  Partial: "default",
  Paid: "secondary",
  Overdue: "destructive",
} as const;

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [expenses, setExpenses] = useState<Tables<"expenses">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    vendor: "",
    receipt_number: "",
  });

  const jobId = params.id as string;

  // Fetch job details and timesheets
  const fetchJobData = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();

      // Fetch job details with customer info
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select(
          `
          *,
          customer_details:customers(id, name, email, phone)
        `
        )
        .eq("id", jobId)
        .single();

      if (jobError) throw jobError;

      // Fetch timesheets for this job with employee details
      const { data: timesheetData, error: timesheetError } = await supabase
        .from("timesheets")
        .select(
          `
          *,
          employee_details:employees(id, name, position)
        `
        )
        .eq("job_site", jobData.name) // Assuming job_site field contains job name
        .order("date", { ascending: false });

      if (timesheetError) throw timesheetError;

      setJob(jobData);
      setTimesheets(timesheetData || []);
    } catch (error) {
      console.error("Error fetching job data:", error);
      toast.error("Failed to fetch job details");
    } finally {
      setIsLoading(false);
    }
  };
  const getExpenses = async () => {
    try {
      const supabase = createClient();
      const response: PostgrestSingleResponse<Tables<"expenses">[]> =
        await supabase.from("expenses").select("*", { count: "exact" });
      if (response.data) {
        setExpenses(response.data);
      }
    } catch (error) {
      console.error("Error fetching getExpenses:", error);
      toast.error("Failed to fetch job details");
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  useEffect(() => {
    getExpenses();
  }, []);

  // Calculate totals
  const totalLaborHours = timesheets.reduce(
    (sum, timesheet) => sum + (timesheet.total_hours ?? 0),
    0
  );
  const totalExpenses = expenses?.reduce(
    (sum, expense) => sum + (expense.amount ?? 0),
    0
  );
  const totalProjectCost = totalExpenses; // In a real app, you'd add labor costs too

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading job details...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Job not found
          </h2>
          <p className="text-muted-foreground mt-2">
            The job you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{job.name}</h1>
            <p className="text-muted-foreground">Quote #{job.quote_number}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge
            variant={
              statusColors[job.status as keyof typeof statusColors] as
                | "secondary"
                | "default"
                | "outline"
                | "destructive"
                | undefined
            }
          >
            {job.status}
          </Badge>
          <Badge
            variant={
              invoiceStatusColors[
                job.invoice_status as keyof typeof invoiceStatusColors
              ] as
                | "secondary"
                | "default"
                | "outline"
                | "destructive"
                | undefined
            }
          >
            {job.invoice_status}
          </Badge>
        </div>
      </div>

      {/* Job Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <p className="mt-1">{job.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Job Type
                </Label>
                <p className="mt-1">{job.type || "Not set"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Budget
                </Label>
                <p className="mt-1 font-semibold">
                  {job.budget ? formatCurrency(job.budget) : "Not set"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Status
                </Label>
                <p className="mt-1">{job.status || "Not set"}</p>
              </div>
            </div>
            {job.invoice_number && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Invoice Number
                </Label>
                <p className="mt-1 font-mono">{job.invoice_number}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold">{job.customer_details?.name}</p>
            </div>
            <div className="space-y-2">
              <a
                href={`mailto:${job.customer_details?.email}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {job.customer_details?.email}
              </a>
              <br />
              <a
                href={`tel:${job.customer_details?.phone}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {job.customer_details?.phone}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Labor Hours
              </span>
              <span className="font-semibold">{totalLaborHours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Expenses
              </span>
              <span className="font-semibold">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span className="font-semibold">
                {job.budget ? formatCurrency(job.budget) : "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span
                className={`font-semibold ${
                  job.budget && job.budget - totalProjectCost >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {job.budget
                  ? formatCurrency(job.budget - totalProjectCost)
                  : "Not set"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timesheets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Labor Hours & Timesheets
          </CardTitle>
          <CardDescription>All timesheet entries for this job</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Lunch</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map(timesheet => (
                <TableRow key={timesheet.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {timesheet.employee_details?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {timesheet.employee_details?.position}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(timesheet.date)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>
                        {timesheet.start_time} - {timesheet.end_time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {timesheet.lunch_start_time && timesheet.lunch_end_time
                      ? `${timesheet.lunch_start_time} - ${timesheet.lunch_end_time}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {timesheet.total_hours}h
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm max-w-xs truncate">
                      {timesheet.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={timesheet.is_locked ? "secondary" : "outline"}
                    >
                      {timesheet.is_locked ? "Locked" : "Unlocked"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {timesheets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No timesheet entries found for this job.
            </div>
          )}
        </CardContent>
      </Card>
      {/* Material Expenses */}
      <MaterialExpenses expenses={expenses} setExpenses={setExpenses} />
    </div>
  );
}
