import { Clock, Calendar, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SummaryCardsProps {
  totalHours: number;
  totalEntries: number;
  lockedEntries: number;
}

export const SummaryCards = ({
  totalHours,
  totalEntries,
  lockedEntries,
}: SummaryCardsProps) => (
  <div className="grid gap-4 md:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalHours.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground">Across all timesheets</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalEntries}</div>
        <p className="text-xs text-muted-foreground">Timesheet records</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Locked Entries</CardTitle>
        <Lock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{lockedEntries}</div>
        <p className="text-xs text-muted-foreground">Cannot be modified</p>
      </CardContent>
    </Card>
  </div>
);
