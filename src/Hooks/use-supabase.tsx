"use client";
import {
  getFromSupabaseTable,
  updateSupabaseRow,
  insertIntoSupabaseTable,
  deleteFromSupabaseTable,
  getUserAction,
} from "@/app/Services/supabase.actions";
import { Database } from "../../database.types";
import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { HandleSupabaseErrorResponse } from "@/lib/error.handle.lib";

export default function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => setError(null);

  const getFetch = async <T = any,>(
    table: keyof Database["public"]["Tables"]
  ): Promise<T> => {
    try {
      setLoading(true);
      const response = await getFromSupabaseTable(table);
      return response as T;
    } catch (err) {
      console.error(`Error fetching from ${table}:`, err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTable = async (
    table: keyof Database["public"]["Tables"],
    eqkey: string,
    eqvalue: string,
    object: Object
  ): Promise<any> => {
    try {
      setLoading(true);
      const response = await updateSupabaseRow(table, eqkey, eqvalue, object);
      return response;
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const insertRow = async (
    table: keyof Database["public"]["Tables"],
    object: Object
  ): Promise<HandleSupabaseErrorResponse<any | null>> => {
    try {
      setLoading(true);
      const response = await insertIntoSupabaseTable(table, object);
      return response;
    } catch (err) {
      console.error(`Error inserting into ${table}:`, err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRow = async (
    table: keyof Database["public"]["Tables"],
    eqkey: string,
    eqvalue: string
  ): Promise<any> => {
    try {
      setLoading(true);
      const response = await deleteFromSupabaseTable(table, eqkey, eqvalue);
      return response;
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getUser = async () => {
    try {
      const response = await getUserAction();
      return response;
    } catch (error) {
      console.error(`Error fetching user`, error);
    }
  };

  return {
    getFetch,
    updateTable,
    insertRow,
    deleteRow,
    loading,
    error,
    resetError,
    getUser,
  };
}
