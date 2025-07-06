import { Tables } from "../../database.types";

export interface TimesheetEntry {
  id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  job_site: string | null;
  description: string | null;
  total_hours: number | null;
  is_locked: boolean | null;
  lunch_start_time: string | null;
  lunch_end_time: string | null;
}

export interface GroupedTimesheet {
  date: string;
  entries: TimesheetEntry[];
  total_hours: number;
  is_locked: boolean;
}

export type Profile = Tables<"employees"> & {
  jobs: {
    name: string;
  };
};

type Timesheet = {
  id: string;
  date: string; // ISO date string, e.g. "2025-07-01"
  start_time: string; // time string, e.g. "06:38:00"
  end_time: string; // time string, e.g. "08:38:00"
  job_site: string | null;
  total_hours: number | null;
  is_locked: boolean | null;
};

export type Employee = {
  id: string;
  name: string | null;
  position: string | null;
  status: string | null;
  total_hours: number;
  timesheets: Timesheet[] | null;
};

export type EmployeesWithTimesheetsResponse = {
  data: Employee[];
  total: number;
  week_start_date: string; // ISO date string, e.g. "2025-07-01"
  week_end_date: string; // ISO date string, e.g. "2025-07-07"
};
