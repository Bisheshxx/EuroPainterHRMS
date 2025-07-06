import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
