"use server";
import { handleSupabaseError } from "@/lib/error.handle.lib";

import { Database } from "../../../database.types";
import { createClient } from "../../../utils/supabase/server";

export const getFromSupabaseTable = async (
  table: keyof Database["public"]["Tables"]
) => {
  const supabase = await createClient();
  const response = await supabase.from(table).select();
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
