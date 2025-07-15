"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserStore from "@/store";

interface Job {
  id: string;
  name: string;
}

interface JobSelectProps {
  field: any;
  placeholder?: string;
}
export default function JobSelect({
  field,
  placeholder = "Select a job",
}: JobSelectProps) {
  // const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { jobs } = useUserStore();

  // Find the job name for display based on the selected ID
  const selectedJob = jobs.find(job => job.id === field.value);
  const displayValue = selectedJob ? selectedJob.name : "";

  return (
    <Select onValueChange={field.onChange} value={field.value || ""}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {false ? (
          <SelectItem value="loading" disabled>
            Loading jobs...
          </SelectItem>
        ) : jobs.length === 0 ? (
          <SelectItem value="no-jobs" disabled>
            No jobs available
          </SelectItem>
        ) : (
          jobs.map(job => (
            <SelectItem key={job.id} value={job.id}>
              {job.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
