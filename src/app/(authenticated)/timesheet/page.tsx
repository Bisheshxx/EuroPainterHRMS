"use client";
import React from "react";
import TimesheetPage from "@/components/Timesheet/TImeSheetPage";
import useSupabase from "@/Hooks/use-supabase";
import useApi from "@/Hooks/use-api";

export default function Timesheet() {
  return <TimesheetPage />;
}
