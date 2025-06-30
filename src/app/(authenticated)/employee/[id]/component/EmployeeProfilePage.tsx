"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  User,
  Clock,
  Building,
} from "lucide-react";
import useSupabase from "@/Hooks/use-supabase";
import { createClient } from "../../../../../../utils/supabase/client";
import RecentTimeSheet from "./RecentTimeSheet";

// Mock data - same as in the main employee page
const mockJobs = [
  { id: "job-1", title: "Downtown Office Project" },
  { id: "job-2", title: "Construction Site A" },
  { id: "job-3", title: "Warehouse Operations" },
  { id: "job-4", title: "Remote Development" },
];

const mockEmployees = [
  {
    id: "emp-1",
    employee_id: 1001,
    name: "John Doe",
    address: "123 Main Street, Downtown, NY 10001",
    email: "john.doe@company.com",
    phone: "(555) 123-4567",
    position: "Senior Developer",
    employment_type: "Full-time",
    status: "ACTIVE",
    payrate: 75.5,
    start_date: "2023-01-15",
    notes:
      "Excellent performance, team lead for mobile projects. Has been instrumental in developing our new customer portal and mentoring junior developers. Shows great leadership potential and technical expertise.",
    job: "job-1",
  },
  {
    id: "emp-2",
    employee_id: 1002,
    name: "Jane Smith",
    address: "456 Oak Avenue, Suburbia, NY 10002",
    email: "jane.smith@company.com",
    phone: "(555) 234-5678",
    position: "Project Manager",
    employment_type: "Full-time",
    status: "ACTIVE",
    payrate: 85.0,
    start_date: "2022-08-20",
    notes:
      "Strong leadership skills, manages multiple projects simultaneously. Excellent communication with clients and stakeholders. Has successfully delivered 15+ projects on time and under budget.",
    job: "job-2",
  },
  {
    id: "emp-3",
    employee_id: 1003,
    name: "Mike Johnson",
    address: "789 Business Blvd, Metro City, NY 10003",
    email: "mike.johnson@company.com",
    phone: "(555) 345-6789",
    position: "Developer",
    employment_type: "Full-time",
    status: "AWAITINGVERIFICATION",
    payrate: 65.0,
    start_date: "2024-01-10",
    notes:
      "New hire, pending background check completion. Previous experience at tech startup. Strong skills in React and Node.js. Eager to contribute to team projects.",
    job: "job-3",
  },
  {
    id: "emp-4",
    employee_id: 1004,
    name: "Sarah Wilson",
    address: "321 Valley Road, Green Valley, NY 10004",
    email: "sarah.wilson@company.com",
    phone: "(555) 456-7890",
    position: "Designer",
    employment_type: "Part-time",
    status: "ACTIVE",
    payrate: 45.0,
    start_date: "2023-06-01",
    notes:
      "Creative designer, works 20 hours per week. Specializes in UI/UX design and brand identity. Has redesigned our main website and improved user engagement by 40%.",
    job: "job-1",
  },
  {
    id: "emp-5",
    employee_id: 1005,
    name: "Robert Brown",
    address: "654 Innovation Drive, Tech Park, NY 10005",
    email: "robert.brown@company.com",
    phone: "(555) 567-8901",
    position: "Intern",
    employment_type: "Intern",
    status: "INACTIVE",
    payrate: 20.0,
    start_date: "2023-09-01",
    notes:
      "Summer intern, contract ended. Computer Science student at State University. Worked on data analysis projects and showed great potential. Eligible for rehire.",
    job: null,
  },
];

// Mock timesheet data for the employee
const mockTimesheets = [
  {
    id: "ts-1",
    date: "2024-01-15",
    start_time: "09:00",
    end_time: "17:00",
    total_hours: 8,
    job_site: "Downtown Office",
    description: "Frontend development work",
  },
  {
    id: "ts-2",
    date: "2024-01-16",
    start_time: "09:00",
    end_time: "17:30",
    total_hours: 8.5,
    job_site: "Downtown Office",
    description: "Code review and testing",
  },
  {
    id: "ts-3",
    date: "2024-01-17",
    start_time: "08:30",
    end_time: "16:30",
    total_hours: 8,
    job_site: "Remote",
    description: "Client meeting and documentation",
  },
];

export default function EmployeeProfilePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getEmployeeProfileById = async () => {
    const supabase = createClient();
    const response = await supabase
      .from("employees")
      .select()
      .eq("id", id)
      .single();
    if (response.data) {
      setEmployee(response.data);
    }
    console.log(response);
  };

  useEffect(() => {
    getEmployeeProfileById();
    // Simulate loading employee data
    const employeeId = params.id as string;
    const foundEmployee = mockEmployees.find(emp => emp.id === employeeId);

    if (foundEmployee) {
      setEmployee(foundEmployee);
    } else {
      //   toast({
      //     variant: "destructive",
      //     title: "Employee Not Found",
      //     description: "The requested employee profile could not be found.",
      //   });
      //   router.push("/employee");
    }

    setLoading(false);
  }, [params.id, router]);

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
    return job ? job.title : "Unknown Job";
  };

  const getEmploymentDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}, ${months} month${
        months > 1 ? "s" : ""
      }`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employee profile...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold capitalize">{employee.name}</h1>
            <p className="text-muted-foreground">
              Employee ID: {employee.employee_id}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/employee/${employee.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Basic Info */}
        <div className="md:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-lg">{employee.name}</h3>
                <p className="text-muted-foreground">{employee.position}</p>
                <Badge
                  variant={getStatusBadgeVariant(employee.status)}
                  className="mt-2"
                >
                  {getStatusLabel(employee.status)}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                {employee.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${employee.email}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {employee.email}
                    </a>
                  </div>
                )}

                {employee.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${employee.phone}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {employee.phone}
                    </a>
                  </div>
                )}

                {employee.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{employee.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Position
                  </label>
                  <p className="text-sm">{employee.position}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Employment Type
                  </label>
                  <p className="text-sm">
                    <Badge variant="outline">{employee.employment_type}</Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Pay Rate
                  </label>
                  <p className="text-sm flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {employee.payrate.toFixed(2)}/hour
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(employee.start_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Employment Duration
                  </label>
                  <p className="text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getEmploymentDuration(employee.start_date)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Assigned Job
                  </label>
                  <p className="text-sm flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {getJobTitle(employee.job)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Notes */}
          {employee.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes & Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{employee.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Recent Timesheets */}
          <RecentTimeSheet />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions for this employee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/timesheet?employee=${employee.id}`)
                  }
                >
                  <Clock className="mr-2 h-4 w-4" />
                  View Timesheets
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/employee/${employee.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${employee.email}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${employee.phone}`)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Employee
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
