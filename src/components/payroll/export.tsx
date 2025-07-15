import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createClient } from "../../../utils/supabase/client";
import { read, utils, writeFileXLSX } from "xlsx";
import { EmployeeProjectHours } from "@/types/types";
import { toast } from "sonner";

export default function ExportButton() {
  const [payrollExcel, setPayrollExcel] = useState<EmployeeProjectHours[]>([]);

  //   const exportFile = useCallback(() => {
  //     const ws = utils.json_to_sheet(payrollExcel);
  //     const wb = utils.book_new();
  //     utils.book_append_sheet(wb, ws, "Data");
  //     writeFileXLSX(wb, "PayrollAdddate.xlsx");
  //   }, [payrollExcel]);

  const getEmployeeTimesheet = async () => {
    const supabase = createClient();
    const response = await supabase.rpc("get_employee_timesheets", {
      p_start_date: null,
      p_end_date: null,
    });
    if (response.data) {
      setPayrollExcel(response.data);
    }
    if (response.error) {
      toast.error("There was an error while fetching the payroll.");
    }
  };

  const exportFile = useCallback(() => {
    const wb = utils.book_new();

    // 1. Collect all unique dates
    const allDatesSet = new Set<string>();
    payrollExcel.forEach(employee => {
      employee.project_hours.forEach(project => {
        project.hours.forEach(entry => {
          allDatesSet.add(entry.date);
        });
      });
    });
    const allDatesArr = Array.from(allDatesSet).sort();
    // Find the earliest date
    const minDateStr = allDatesArr[0];
    const minDate = new Date(minDateStr);
    // Build a 7-day week from the earliest date
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(minDate);
      d.setDate(minDate.getDate() + i);
      // Format as yyyy-mm-dd
      return d.toISOString().slice(0, 10);
    });
    const fromDate = weekDates[0];
    const toDate = weekDates[6];

    // 2. Build header row (add Total Hours and Total Payment)
    const sheetHeader = [
      "Name",
      "Payrate",
      "Project",
      "Total Hours",
      "Total Payment",
      ...weekDates,
    ];

    // 3. Build data rows
    const sheetRows = payrollExcel.flatMap(employee =>
      employee.project_hours.map(project => {
        // Map date to hours
        const dateToHours: Record<string, number> = {};
        project.hours.forEach(entry => {
          dateToHours[entry.date] = entry.hours;
        });
        // Calculate total hours for the week
        const totalHours = weekDates.reduce(
          (sum, date) => sum + (dateToHours[date] ?? 0),
          0
        );
        // Calculate total payment for the week
        const totalPayment = totalHours * Number(employee.payrate);
        return [
          employee.employee_name,
          employee.payrate,
          project.projectname.trim(),
          totalHours,
          totalPayment,
          ...weekDates.map(date => dateToHours[date] ?? 0),
        ];
      })
    );

    // 4. Combine header and rows
    const sheetData = [
      ["Payroll Report"],
      ["report for", "Euro Painters"],
      ["From:", fromDate, "To:", toDate],
      sheetHeader,
      ...sheetRows,
    ];

    const ws = utils.aoa_to_sheet(sheetData);

    // 5. Find merge ranges for Name and Payrate columns
    const merges = [];
    let rowStart = 0;
    while (rowStart < sheetRows.length) {
      const [name, payrate] = sheetRows[rowStart];
      let rowEnd = rowStart;
      while (
        rowEnd + 1 < sheetRows.length &&
        sheetRows[rowEnd + 1][0] === name &&
        sheetRows[rowEnd + 1][1] === payrate
      ) {
        rowEnd++;
      }
      if (rowEnd > rowStart) {
        // Merge Name column
        merges.push({
          s: { r: 4 + rowStart, c: 0 }, // 4 header rows above
          e: { r: 4 + rowEnd, c: 0 },
        });
        // Merge Payrate column
        merges.push({
          s: { r: 4 + rowStart, c: 1 },
          e: { r: 4 + rowEnd, c: 1 },
        });
      }
      rowStart = rowEnd + 1;
    }
    ws["!merges"] = merges;

    ws["!cols"] = [
      { wch: 20 },
      { wch: 10 },
      { wch: 20 },
      { wch: 12 }, // Total Hours
      { wch: 15 }, // Total Payment
      ...weekDates.map(() => ({ wch: 12 })),
    ];
    utils.book_append_sheet(wb, ws, "Payroll Report");
    writeFileXLSX(wb, "Payroll_Custom.xlsx");
  }, [payrollExcel]);
  useEffect(() => {
    getEmployeeTimesheet();
  }, []);

  return <Button onClick={exportFile}>Export</Button>;
}
