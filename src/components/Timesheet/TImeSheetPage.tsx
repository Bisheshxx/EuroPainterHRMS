"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Calendar,
  Clock,
} from "lucide-react";
import { Tables } from "../../../database.types";
import { TimesheetForm } from "./TimesheetForm";
import { TimesheetTable } from "./TimesheetTable";
import { SummaryCards } from "./SummaryCards";
import { GroupedTimesheet } from "@/types/types";
import useSupabase from "@/Hooks/use-supabase";
import { useUser } from "../Providers/UserProvider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { createClient } from "../../../utils/supabase/client";

interface IProps {
  timesheet: Tables<"timesheets">[];
}

export default function TimesheetPage({ timesheet }: IProps) {
  const [timesheets, setTimesheets] = useState(timesheet);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<any>(null);
  const { insertRow, updateTable, deleteRow } = useSupabase();
  const { user } = useUser();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    job_site: "",
    description: null as string | null,
    total_hours: null as number | null,
    is_locked: false,
  });
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const calculateHours = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(0, diffHours);
  };

  const handleTimeChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    if (field === "start_time" || field === "end_time") {
      const hours = calculateHours(
        field === "start_time" ? value : formData.start_time,
        field === "end_time" ? value : formData.end_time
      );
      newFormData.total_hours = hours;
    }
    setFormData(newFormData);
  };

  const createTimeSheet = async (data: typeof formData) => {
    try {
      const response = await insertRow("timesheets", {
        ...data,
        employee_id: user?.data?.user?.id,
      });
      if (response.success && response.data) {
        console.log(
          response.data[0],
          "this is the response my firnd for the timesheet"
        );
        setTimesheets(prev => [...prev, response.data[0]]);
        toast.success("Timesheet has been created");
        setIsDialogOpen(false);
      }
      if (response.error) {
        toast.error("Timesheet has not been created! Something went wrong!");
      }
    } catch (error) {}
  };

  const updateTimeSheet = async (data: typeof formData) => {
    try {
      const response = await updateTable(
        "timesheets",
        "id",
        editingTimesheet.id,
        {
          ...data,
          employee_id: user?.data?.user?.id,
        }
      );
      if (response.success && response.data) {
        setTimesheets(prev =>
          prev.map(ts =>
            ts.id === editingTimesheet.id ? response.data[0] : ts
          )
        );
        toast.success("Timesheet has been updated");
        setIsDialogOpen(false);
      }
      if (response.error) {
        toast.error("Failed to update timesheet!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleSubmit = (data: typeof formData) => {
    if (editingTimesheet) {
      // Update existing timesheet
      updateTimeSheet(data);
    } else {
      // Create new timesheet
      createTimeSheet(data);
    }
  };

  const handleEdit = (timesheet: any) => {
    setEditingTimesheet(timesheet);
    console.log(timesheet, "this is to edit");
    setFormData(timesheet);
    setIsDialogOpen(true);
  };

  const handleDelete = async (timesheet: any) => {
    try {
      const response = await deleteRow("timesheets", "id", timesheet.id);
      if (response.success) {
        setTimesheets(prev => prev.filter(ts => ts.id !== timesheet.id));
        toast.success("Timesheet has been deleted");
      }
      if (response.error) {
        toast.error("Failed to delete timesheet!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const toggleLock = (timesheet: any) => {
    setTimesheets(prev =>
      prev.map(ts =>
        ts === timesheet ? { ...ts, is_locked: !ts.is_locked } : ts
      )
    );
  };

  const totalHours = timesheets.reduce(
    (sum, ts) => sum + (ts.total_hours ?? 0),
    0
  );
  const lockedEntries = timesheets.filter(ts => ts.is_locked).length;

  const getWeekDates = (date: string) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
    };
  };

  const fetchTimesheets = async (date?: string) => {
    try {
      if (date) {
        const { start, end } = getWeekDates(date);
        const { data, error } = await supabase
          .from("timesheets")
          .select("*")
          .gte("date", start)
          .lte("date", end)
          .order("date", { ascending: true });

        if (error) throw error;
        setTimesheets(data);
      } else {
        const { data, error } = await supabase
          .from("timesheets")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        setTimesheets(data);
      }
    } catch (error) {
      toast.error("Failed to fetch timesheets");
    }
  };

  useEffect(() => {
    fetchTimesheets(selectedDate);
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">John Doe - Timesheet</h1>
          <p className="text-muted-foreground">
            Manage your time tracking and hours
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-[200px]"
          />
          <Button
            onClick={() => {
              setEditingTimesheet(null);
              setFormData({
                date: "",
                start_time: "",
                end_time: "",
                job_site: "",
                description: null,
                total_hours: null,
                is_locked: false,
              });
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Timesheet
          </Button>
        </div>
      </div>

      <SummaryCards
        totalHours={timesheets.reduce(
          (sum, ts) => sum + (ts.total_hours ?? 0),
          0
        )}
        totalEntries={timesheets.length}
        lockedEntries={timesheets.filter(ts => ts.is_locked).length}
      />

      <Card>
        <CardHeader>
          <CardTitle>Timesheet Records</CardTitle>
          <CardDescription>
            View and manage all employee timesheet entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimesheetTable
            timesheets={timesheets}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleLock={toggleLock}
          />
        </CardContent>
      </Card>

      <TimesheetForm
        isOpen={isDialogOpen}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingTimesheet(null);
            setFormData({
              date: "",
              start_time: "",
              end_time: "",
              job_site: "",
              description: null,
              total_hours: null,
              is_locked: false,
            });
          }
        }}
        formData={formData}
        onSubmit={handleSubmit}
        isEditing={!!editingTimesheet}
      />
    </div>
  );
}
