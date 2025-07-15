import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tables } from "../../database.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMonday = (d: string | null) => {
  if (!d) return null;
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Sunday = 0
  return new Date(date.setDate(diff)).toISOString().split("T")[0];
};

export function getJobNameById(
  jobs: Tables<"jobs">[],
  jobId: string | null | undefined
): string {
  if (!jobId) return "";
  const job = jobs.find(j => j.id === jobId);
  return job ? job.name : "Unknown Job";
}

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
