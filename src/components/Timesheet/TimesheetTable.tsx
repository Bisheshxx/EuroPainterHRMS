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

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time.split(":").slice(0, 2).join(":");
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
                  key={`${date}-${index}`}
                  className="hover:bg-muted/50"
                >
                  {index === 0 && (
                    <TableCell
                      // className="hidden md:table-cell font-medium align-top"
                      className="hidden md:table-cell font-medium text-center align-middle"
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
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

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => console.log("this is for the lunch")}
                            className="h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Hamburger className="h-2 w-2 md:h-4 md:w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className=" flex flex-col gap-2">
                          <div className=" flex flex-col gap-1">
                            <span>Start:</span>
                            <Input
                              type="time"
                              // {...field}
                              // value={field.value || ""}
                            />
                          </div>
                          <div className=" flex flex-col gap-1">
                            <span>Start:</span>
                            <Input
                              type="time"
                              // {...field}
                              // value={field.value || ""}
                            />
                          </div>
                          <Button>Submit</Button>
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
