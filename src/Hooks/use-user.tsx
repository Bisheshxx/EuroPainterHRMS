"use client";
import React, { useEffect, useState } from "react";
import useSupabase from "./use-supabase";
import { User, UserResponse } from "@supabase/supabase-js";

export default function useGetUser() {
  const { getUser } = useSupabase();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchuser = async () => {
    setLoading(true);
    const response = await getUser();
    if (response?.data) {
      setUser(response.data.user);
      setError(false);
    } else {
      setUser(null);
      setError(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchuser();
  }, []);
  return {
    user,
    loading,
    error,
  };
}
