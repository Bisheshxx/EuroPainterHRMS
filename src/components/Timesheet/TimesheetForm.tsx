import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
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
import { useContext, useEffect } from "react";

const timesheetSchema = z.object({
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  job_site: z.string().min(1, "Job site is required"),
  description: z.string().nullable(),
  total_hours: z.number().min(0, "Total hours must be positive").nullable(),
  is_locked: z.boolean(),
});

type TimesheetFormValues = z.infer<typeof timesheetSchema>;

interface TimesheetFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TimesheetFormValues;
  onSubmit: (data: TimesheetFormValues) => void;
  isEditing: boolean;
}

const calculateTotalHours = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  let hours = endHours - startHours;
  let minutes = endMinutes - startMinutes;

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  if (hours < 0) {
    hours += 24;
  }

  return Number((hours + minutes / 60).toFixed(2));
};

export const TimesheetForm = ({
  isOpen,
  onOpenChange,
  formData,
  onSubmit,
  isEditing,
}: TimesheetFormProps) => {
  const form = useForm<TimesheetFormValues>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: formData,
  });

  // Reset form when formData changes
  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  const handleSubmit = (data: TimesheetFormValues) => {
    onSubmit(data);
    // onOpenChange(false);
  };

  // Watch start_time and end_time for automatic calculation
  const startTime = form.watch("start_time");
  const endTime = form.watch("end_time");

  useEffect(() => {
    const totalHours = calculateTotalHours(startTime, endTime);
    form.setValue("total_hours", totalHours);
  }, [startTime, endTime, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Timesheet</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the timesheet details."
              : "Add a new timesheet entry."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="job_site"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Site</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter job site location"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the work performed"
                      rows={3}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      {...field}
                      value={field.value || ""}
                      disabled
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update" : "Add"} Timesheet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
