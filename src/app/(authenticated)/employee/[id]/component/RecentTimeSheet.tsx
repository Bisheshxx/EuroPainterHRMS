import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Database, Tables } from "../../../../../../database.types";
import { createClient } from "../../../../../../utils/supabase/client";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface TimesheetWithJobs {
  approved: boolean;
  date: string;
  description: string | null;
  employee_id: string | null;
  end_time: string | null;
  id: string;
  is_locked: boolean | null;
  job_site: string | null;
  lunch_end_time: string | null;
  lunch_start_time: string | null;
  start_time: string | null;
  total_hours: number | null;
  jobs: {
    name: string;
  };
}

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    monday: monday.toISOString().split("T")[0], // 'YYYY-MM-DD'
    sunday: sunday.toISOString().split("T")[0], // 'YYYY-MM-DD'
  };
}

export default function RecentTimeSheet() {
  const params = useParams();
  const employeeId = params.id as string;
  const [timesheets, setTimeSheets] = useState<TimesheetWithJobs[]>([]);
  const getTimesheet = async () => {
    try {
      const supabase = createClient();
      const { monday, sunday } = getCurrentWeekRange();
      const { data, error } = await supabase
        .from("timesheets")
        .select("*, jobs(name)")
        .eq("employee_id", employeeId)
        .gte("date", monday)
        .lte("date", sunday)
        .order("date", { ascending: false });
      if (data) {
        setTimeSheets(data);
      }
      if (error) {
        toast.error(
          "There was an error while fetching this employee's timesheets!"
        );
      }
    } catch (error) {
      console.error("error in getTimesheet", error);
    }
  };

  // Filter timesheets for current week (not strictly needed anymore, but keep for safety)
  const { monday, sunday } = getCurrentWeekRange();
  const mondayDate = new Date(monday);
  const sundayDate = new Date(sunday);
  const weekTimesheets = timesheets.filter(ts => {
    const tsDate = new Date(ts.date);
    return tsDate >= mondayDate && tsDate <= sundayDate;
  });

  const calculateTotalHours = () => {
    return weekTimesheets.reduce(
      (total, timesheet) => total + (timesheet.total_hours ?? 0),
      0
    );
  };
  useEffect(() => {
    getTimesheet();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Timesheets
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/timesheet")}
          >
            View All
          </Button>
        </div>
        {/* <CardDescription>Last 3 timesheet entries</CardDescription>*/}
      </CardHeader>
      <CardContent className="max-h-[350px] overflow-y-auto">
        {weekTimesheets.length > 0 ? (
          <div className="space-y-4">
            {weekTimesheets.map(timesheet => (
              <div
                key={timesheet.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(timesheet.date).toLocaleDateString()} -{" "}
                      {new Date(timesheet.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {timesheet.start_time} - {timesheet.end_time} •{" "}
                    {timesheet.jobs.name}
                  </div>
                  <div className="text-sm">{timesheet.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{timesheet.total_hours}h</div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-medium">Total Hours (This Week)</span>
              <span className="font-bold">{calculateTotalHours()}h</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No timesheet entries found
          </p>
        )}
      </CardContent>
    </Card>
  );
}
