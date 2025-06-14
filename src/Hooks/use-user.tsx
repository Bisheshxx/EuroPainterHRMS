"use client";
import React, { useEffect } from "react";
import useSupabase from "./use-supabase";
import { useUser } from "@/components/Providers/UserProvider";

export default function useGetUser() {
  const { getUser } = useSupabase();

  const { user, setUser } = useUser();

  const fetchuser = async () => {
    const response = await getUser();
    if (response?.data) setUser(response);
  };
  useEffect(() => {
    fetchuser();
  }, []);
}
