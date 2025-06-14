import { Edit, Unlock, Trash2, Lock, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TimesheetEntry } from "@/types/types";

interface TimesheetTableProps {
  timesheets: TimesheetEntry[];
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
  onToggleLock: (entry: TimesheetEntry) => void;
}

export const TimesheetTable = ({
  timesheets,
  onEdit,
  onDelete,
  onToggleLock,
}: TimesheetTableProps) => {
  // Group timesheets by date
  const groupedByDate = timesheets.reduce((acc, ts) => {
    const date = ts.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(ts);
    return acc;
  }, {} as Record<string, TimesheetEntry[]>);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    return `${weekday} ${month}/${day}`;
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time.split(":").slice(0, 2).join(":");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Job Site</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Total Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
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
              <TableRow key={`${date}-${index}`}>
                {index === 0 ? (
                  <TableCell rowSpan={entries.length}>
                    {formatDate(date)}
                  </TableCell>
                ) : null}
                <TableCell>{formatTime(timesheet.start_time)}</TableCell>
                <TableCell>{formatTime(timesheet.end_time)}</TableCell>
                <TableCell>{timesheet.job_site || "-"}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {timesheet.description || "-"}
                </TableCell>
                <TableCell>
                  {(timesheet.total_hours ?? 0).toFixed(2)}h
                </TableCell>
                <TableCell>
                  <Badge
                    variant={timesheet.is_locked ? "destructive" : "default"}
                  >
                    {timesheet.is_locked ? "Locked" : "Unlocked"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(timesheet)}
                      disabled={timesheet.is_locked ?? false}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleLock(timesheet)}
                    >
                      {timesheet.is_locked ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(timesheet)}
                      disabled={timesheet.is_locked ?? false}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )
        )}
      </TableBody>
    </Table>
  );
};
