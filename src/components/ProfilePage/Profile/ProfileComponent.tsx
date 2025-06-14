"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
} from "lucide-react";
import {
  getInitials,
  getStatusColor,
  getEmploymentTypeColor,
  formatDate,
  formatCurrency,
} from "@/lib/Profile.lib";
import { CreateProfileDialog } from "./CreateProfileDialog";
import { Tables } from "../../../../database.types";
import useUserStore from "@/store";
import { useEffect } from "react";

interface IProps {
  profile: Tables<"employees">;
}
export default function ProfileComponent({ profile }: IProps) {
  ///getuser accound stats through a provider and check user status here
  const { setProfile } = useUserStore();
  useEffect(() => {
    setProfile(profile);
  }, [profile]);
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt={profile.name || "Employee"}
            />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.name || "Unknown Employee"}
            </h1>
            <p className="text-lg text-gray-600">
              {profile.position || "Position not specified"}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className={getStatusColor(profile.status)}>
                {profile.status || "Unknown"}
              </Badge>
              <Badge
                className={getEmploymentTypeColor(profile.employment_type)}
              >
                {profile.employment_type || "Not specified"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <CreateProfileDialog
            isOpen={profile.employment_type === "AWAITINGVERIFICATION"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Contact details and personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{profile.email || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm">{profile.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm">{profile.address || "Not provided"}</p>
              </div>
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
            <CardDescription>
              Job position and employment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Position</p>
                <p className="text-sm">{profile.position || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-sm">{formatDate(profile.start_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Pay Rate</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(profile.payrate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        {profile.notes && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Notes
              </CardTitle>
              <CardDescription>
                Additional information and comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{profile.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Employee ID */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Employee ID</p>
              <p className="text-sm font-mono">{profile.employee_id}</p>
            </div>
            {profile.job && (
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Job Reference
                </p>
                <p className="text-sm font-mono">{profile.job}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
