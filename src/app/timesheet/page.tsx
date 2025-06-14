"use client";
import React from "react";
import TimesheetPage from "@/components/Timesheet/TImeSheetPage";
import useSupabase from "@/Hooks/use-supabase";
import useApi from "@/Hooks/use-api";

export default function Timesheet() {
  const { getFetch } = useSupabase();
  const fetchTimesheets = () => getFetch("timesheets");
  const { loading, error, data } = useApi("timesheet", fetchTimesheets);
  console.log(data, "tjis is the timesheet");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <TimesheetPage timesheet={data || []} />;
}
