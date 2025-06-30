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

export default function RecentTimeSheet() {
  const [timesheets, setTimeSheets] = useState<Tables<"timesheets">[]>([]);
  const getTimesheet = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("timesheets")
        .select()
        .order("date", { ascending: false })
        .limit(3);
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
  const calculateTotalHours = () => {
    return timesheets.reduce(
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
        <CardDescription>Last 3 timesheet entries</CardDescription>
      </CardHeader>
      <CardContent>
        {timesheets.length > 0 ? (
          <div className="space-y-4">
            {timesheets.map(timesheet => (
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
                    {timesheet.job_site}
                  </div>
                  <div className="text-sm">{timesheet.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{timesheet.total_hours}h</div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-medium">Total Hours (Recent)</span>
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
