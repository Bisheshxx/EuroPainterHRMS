"use server";
import { handleSupabaseError } from "@/lib/error.handle.lib";

import { Database } from "../../../database.types";
import { createClient } from "../../../utils/supabase/server";

export const getFromSupabaseTable = async (
  table: keyof Database["public"]["Tables"],
  page: number = 1,
  limit: number = 10,
  filter?: Record<string, any>
) => {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from(table).select("*", { count: "exact" });

  // Apply filters if provided
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "name") {
          query = query.ilike("name", `%${value}%`);
        } else {
          query = query.eq(key, value);
        }
      }
    });
  }

  const response = await query.range(from, to);

  return handleSupabaseError(response);
};

export const updateSupabaseRow = async (
  table: keyof Database["public"]["Tables"],
  key: string,
  value: string,
  object: Object
) => {
  const supabase = await createClient();
  const response = await supabase
    .from(table)
    .update(object)
    .eq(key, value)
    .select();
  return handleSupabaseError(response);
};

export const createSupabaseRow = async (
  table: keyof Database["public"]["Tables"],
  object: Object
) => {
  const supabase = await createClient();
  const response = await supabase.from(table).insert(object);
  return handleSupabaseError(response);
};
export const insertIntoSupabaseTable = async (
  table: string,
  object: Object
) => {
  const supabase = await createClient();
  const response = await supabase.from(table).insert(object).select();
  return handleSupabaseError(response);
};

export const deleteFromSupabaseTable = async (
  table: keyof Database["public"]["Tables"],
  eqkey: string,
  eqvalue: string
) => {
  const supabase = await createClient();
  const response = await supabase.from(table).delete().eq(eqkey, eqvalue);
  return handleSupabaseError(response);
};
export const getUserAction = async () => {
  const supabase = await createClient();
  const response = await supabase.auth.getUser();
  return response;
};
export const getEmployeeAction = async () => {
  const supabase = await createClient();
  let response = await supabase.from("employees").select("*");
  return handleSupabaseError(response);
};
