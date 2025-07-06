import { Edit, Unlock, Trash2, Lock, Plus, Hamburger } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { TimesheetEntry } from "@/types/types";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createClient } from "../../../utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const lunchTimeSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type LunchTimeFormValues = z.infer<typeof lunchTimeSchema>;

interface TimesheetTableProps {
  timesheets: TimesheetEntry[];
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
  onToggleLock: (entry: TimesheetEntry) => void;
  onLunchTimeUpdate?: (updatedTimesheet: TimesheetEntry) => void;
}

export const TimesheetTable = ({
  timesheets,
  onEdit,
  onDelete,
  onToggleLock,
  onLunchTimeUpdate,
}: TimesheetTableProps) => {
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<
    string | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group timesheets by date with ID
  const groupedByDate = timesheets.reduce((acc, ts) => {
    const date = ts.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      ...ts,
      groupId: `${date}-${ts.id}`, // Include ID in the group
    });
    return acc;
  }, {} as Record<string, (TimesheetEntry & { groupId: string })[]>);

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time.split(":").slice(0, 2).join(":");
  };

  const form = useForm<LunchTimeFormValues>({
    resolver: zodResolver(lunchTimeSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (data: LunchTimeFormValues) => {
    if (!selectedTimesheetId) {
      toast.error("No timesheet selected");
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = createClient();
      const response = await supabase
        .from("timesheets")
        .update({
          lunch_start_time: data.startTime,
          lunch_end_time: data.endTime,
        })
        .eq("id", selectedTimesheetId)
        .select();

      if (response.error) {
        throw response.error;
      }

      if (response.data && response.data.length > 0) {
        const updatedTimesheet = response.data[0];

        // Update the timesheet state in parent component
        if (onLunchTimeUpdate) {
          onLunchTimeUpdate(updatedTimesheet);
        }

        // Reset form
        form.reset();
        setSelectedTimesheetId(undefined);

        toast.success("Lunch time updated successfully");
      }
    } catch (error) {
      console.error("Error updating lunch time:", error);
      toast.error("Failed to update lunch time");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Time</TableHead>
            <TableHead className="hidden sm:table-cell">Job Site</TableHead>
            <TableHead className="hidden lg:table-cell">Description</TableHead>
            <TableHead className="text-center ">Hours</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(groupedByDate).length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">No timesheets found</p>
                  <Button onClick={() => onEdit({} as TimesheetEntry)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Timesheet
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            Object.entries(groupedByDate).map(([date, entries]) =>
              entries.map((timesheet, index) => (
                <TableRow
                  key={timesheet.groupId}
                  className={index === 0 ? "border-t-2 border-t-gray-200" : ""}
                >
                  {index === 0 && (
                    <TableCell
                      className="hidden md:table-cell font-medium align-middle"
                      rowSpan={entries.length}
                    >
                      {format(new Date(date), "MMM d, yyyy")}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatTime(timesheet.start_time)} -{" "}
                          {formatTime(timesheet.end_time)}
                        </span>
                        <Badge variant="outline" className="md:hidden">
                          {(timesheet.total_hours ?? 0).toFixed(2)}h
                        </Badge>
                      </div>
                      {(timesheet.lunch_start_time ||
                        timesheet.lunch_end_time) && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Lunch: {formatTime(timesheet.lunch_start_time)} -{" "}
                            {formatTime(timesheet.lunch_end_time)}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 md:hidden">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(date), "MMM d, yyyy")}
                        </span>
                        {timesheet.job_site && (
                          <span className="text-sm text-muted-foreground">
                            {timesheet.job_site}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {timesheet.job_site || "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {timesheet.description || "-"}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {(timesheet.total_hours ?? 0).toFixed(2)}h
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(timesheet)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Edit className="h-2 w-2 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(timesheet)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Trash2 className="h-2 w-2 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleLock(timesheet)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        {timesheet.is_locked ? (
                          <Lock className="h-2 w-2 md:h-4 md:w-4" />
                        ) : (
                          <Unlock className="h-2 w-2 md:h-4 md:w-4" />
                        )}
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9"
                            onClick={() => setSelectedTimesheetId(timesheet.id)}
                          >
                            <Hamburger className="h-2 w-2 md:h-4 md:w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">
                                  Lunch Time
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Set your lunch break time for this entry.
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="startTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Start Time</FormLabel>
                                      <FormControl>
                                        <Input type="time" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="endTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>End Time</FormLabel>
                                      <FormControl>
                                        <Input type="time" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Updating..." : "Submit"}
                              </Button>
                            </form>
                          </Form>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};
