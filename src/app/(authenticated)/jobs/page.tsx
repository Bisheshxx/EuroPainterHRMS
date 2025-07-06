"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Users,
  CheckCircle,
  DollarSign,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Tables } from "../../../../database.types";
import { createClient } from "../../../../utils/supabase/client";
import useSupabase from "@/Hooks/use-supabase";

// Job schema based on the database table
const jobSchema = z.object({
  quote_number: z.string().min(1, "Quote number is required"),
  name: z.string().min(1, "Job name is required"),
  customer: z.string().min(1, "Customer is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  budget: z.string().min(1, "Budget is required"),
  invoice_status: z.string().min(1, "Invoice status is required"),
  invoice_number: z.string().min(1, "Invoice number is required"),
  type: z.string().min(1, "Job type is required"),
});

type JobFormData = z.infer<typeof jobSchema>;

type Job = Tables<"jobs"> & {
  customer_details?: {
    id: string;
    name: string;
  } | null;
};

const jobStatuses = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
];

const invoiceStatuses = [
  "Not Invoiced",
  "Pending",
  "Partial",
  "Paid",
  "Overdue",
];

const jobTypes = [
  "New Construction",
  "Renovation",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Maintenance",
];

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const { insertRow, updateTable, deleteRow } = useSupabase();

  // React Hook Form setup
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      quote_number: "",
      name: "",
      customer: "",
      description: "",
      status: "",
      budget: "",
      invoice_status: "",
      invoice_number: "",
      type: "",
    },
  });

  // Calculate summary statistics
  const totalJobs = totalCount;
  const activeJobs = jobs.filter(
    (job: Job) => job.status === "In Progress" || job.status === "Planning"
  ).length;
  const completedJobs = jobs.filter(
    (job: Job) => job.status === "Completed"
  ).length;
  const totalBudget = jobs.reduce(
    (sum: number, job: Job) => sum + (job.budget ?? 0),
    0
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const resetForm = () => {
    form.reset({
      quote_number: "",
      name: "",
      customer: "",
      description: "",
      status: "",
      budget: "",
      invoice_status: "",
      invoice_number: "",
      type: "",
    });
    setEditingJob(null);
  };

  // Fetch customers for the dropdown
  const fetchCustomers = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customers")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers");
    }
  };

  const fetchJobs = async () => {
    try {
      const supabase = createClient();
      setIsLoading(true);

      let query = supabase.from("jobs").select(
        `
          *,
          customer_details:customers(id, name)
        `,
        { count: "exact" }
      );

      // Apply search filter
      if (searchTerm) {
        // First, find customer IDs that match the search term
        const { data: customerMatches } = await supabase
          .from("customers")
          .select("id")
          .ilike("name", `%${searchTerm}%`);

        const customerIds = customerMatches?.map(c => c.id) || [];

        // Search in jobs table and include customer IDs
        query = query.or(
          `name.ilike.%${searchTerm}%,quote_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      // Apply status filter
      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setJobs(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

  const handleSubmit = async (data: JobFormData) => {
    try {
      const jobData = {
        quote_number: data.quote_number || null,
        name: data.name,
        customer: data.customer || null,
        description: data.description || null,
        status: data.status || null,
        budget: data.budget ? parseFloat(data.budget) : null,
        invoice_status: data.invoice_status || null,
        invoice_number: data.invoice_number || null,
        type: data.type || null,
      };

      if (editingJob) {
        const response = await updateTable(
          "jobs",
          "id",
          editingJob.id,
          jobData
        );
        if (response.success && response.data) {
          // Update the existing job in the state
          const updatedJob = response.data[0];
          setJobs(prevJobs =>
            prevJobs.map(job =>
              job.id === editingJob.id
                ? {
                    ...updatedJob,
                    customer_details: editingJob.customer_details,
                  }
                : job
            )
          );
          toast.success(`${jobData.name} has been updated successfully.`);
        } else {
          toast.error("Failed to update job");
        }
      } else {
        const response = await insertRow("jobs", jobData);
        if (response.success && response.data) {
          // Add the new job to the beginning of the list
          const newJob = response.data[0];
          // Fetch customer details for the new job
          const supabase = createClient();
          const { data: customerData } = await supabase
            .from("customers")
            .select("id, name")
            .eq("id", newJob.customer)
            .single();

          const jobWithCustomer = {
            ...newJob,
            customer_details: customerData,
          };

          setJobs(prevJobs => [jobWithCustomer, ...prevJobs]);
          setTotalCount(prev => prev + 1);
          toast.success(`${jobData.name} has been created successfully.`);
        } else {
          toast.error("Failed to create job");
        }
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    form.reset({
      quote_number: job.quote_number || "",
      name: job.name || "",
      customer: job.customer || "",
      description: job.description || "",
      status: job.status || "",
      budget: job.budget?.toString() || "",
      invoice_status: job.invoice_status || "",
      invoice_number: job.invoice_number || "",
      type: job.type || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (jobId: string) => {
    try {
      const job = jobs.find((j: Job) => j.id === jobId);
      const response = await deleteRow("jobs", "id", jobId);

      if (response.success) {
        // Remove the job from state
        setJobs(prevJobs => prevJobs.filter(j => j.id !== jobId));
        setTotalCount(prev => prev - 1);
        toast.success(`${job?.name} has been deleted successfully.`);
      } else {
        toast.error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || statusFilter;

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jobs Management</h1>
          <p className="text-muted-foreground">
            Manage your construction jobs and projects
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? "Edit Job" : "Add New Job"}
              </DialogTitle>
              <DialogDescription>
                {editingJob
                  ? "Update the job information below."
                  : "Enter the details for the new job."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quote_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Q-2024-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter job name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {customers.map(customer => (
                                <SelectItem
                                  key={customer.id}
                                  value={customer.id}
                                >
                                  {customer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jobTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter job description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jobStatuses.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="invoice_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Status *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select invoice status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {invoiceStatuses.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoice_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="INV-2024-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingJob ? "Update Job" : "Create Job"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">All jobs in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              In progress or planning
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Jobs
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined project value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>
                {hasActiveFilters
                  ? `Showing ${jobs.length} of ${totalJobs} jobs`
                  : `Manage and track all your construction jobs (${totalJobs} total)`}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {jobStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-2">
              {searchTerm && (
                <Badge variant="secondary">Search: {searchTerm}</Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary">Status: {statusFilter}</Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading jobs...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Invoice Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {job.quote_number || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="font-medium hover:underline text-blue-600"
                          >
                            {job.name}
                          </Link>
                          {job.description && (
                            <p
                              className="text-sm text-muted-foreground truncate max-w-xs"
                              title={job.description}
                            >
                              {job.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{job.customer_details?.name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.type || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusColors[
                              job.status as keyof typeof statusColors
                            ] as
                              | "secondary"
                              | "default"
                              | "outline"
                              | "destructive"
                              | undefined
                          }
                        >
                          {job.status || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {job.budget ? formatCurrency(job.budget) : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
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
                            {job.invoice_status || "-"}
                          </Badge>
                          {job.invoice_number && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {job.invoice_number}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(job)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {jobs.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  {hasActiveFilters
                    ? "No jobs match your current filters."
                    : "No jobs found. Create your first job to get started."}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
              jobs
            </p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">per page</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )
              ) : (
                // Show ellipsis for more than 5 pages
                <>
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>

                  {currentPage > 3 && <span className="px-2">...</span>}

                  {Array.from({ length: 3 }, (_, i) => {
                    const page = Math.max(
                      2,
                      Math.min(totalPages - 1, currentPage - 1 + i)
                    );
                    if (page === 1 || page === totalPages) return null;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  }).filter(Boolean)}

                  {currentPage < totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}

                  {totalPages > 1 && (
                    <Button
                      variant={
                        currentPage === totalPages ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
