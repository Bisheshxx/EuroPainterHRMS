export interface TimesheetEntry {
  date: string;
  start_time: string | null;
  end_time: string | null;
  job_site: string | null;
  description: string | null;
  total_hours: number | null;
  is_locked: boolean | null;
}

export interface GroupedTimesheet {
  date: string;
  entries: TimesheetEntry[];
  total_hours: number;
  is_locked: boolean;
}
