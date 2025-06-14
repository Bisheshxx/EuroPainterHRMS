"use server";
import { SupabaseResponse } from "@/types/supabase.types";
import { createClient } from "../../utils/supabase/server";

export type HandleSupabaseErrorResponse<T> = {
  error: boolean; // Indicates if an error occurred
  message: string; // Describes the error or success message
  data: T | undefined; // Holds the data if the operation is successful
  success: boolean; // Indicates if the operation was successful
};

export async function handleSupabaseError<T>(response: SupabaseResponse<T>) {
  const { error } = response;
  if (error) {
    return {
      error: true,
      message: error.message,
      data: null,
      success: false,
    };
  }
  return {
    error: false,
    message: "Success",
    data: response.data || undefined,
    success: true,
    count: response.count,
  };
}
