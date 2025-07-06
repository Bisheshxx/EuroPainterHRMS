"use client";
// src/components/Providers/UserProvider.tsx
import useGetUser from "@/Hooks/use-user";
import { User, UserResponse } from "@supabase/supabase-js";
import React, { createContext, useState, useEffect, useContext } from "react";
import { Loader2 } from "lucide-react";
import Loading from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import useUserStore from "@/store";
import { Tables } from "../../../database.types";
import { createClient } from "../../../utils/supabase/client";

export const UserContext = createContext<User | null>(null);

interface IProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: IProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { user: userResponse, loading, error } = useGetUser();
  const { profile, setProfile } = useUserStore();
  const [employeeDetails, setEmployeeDetails] =
    useState<Tables<"employees"> | null>(null);
  useGetUser();
  const getEmployee = async () => {
    try {
      const supabase = createClient();
      const response = await supabase.from("employees").select("*");
      if (response.data && response.data.length > 0) {
        const employee = response.data[0];
        setProfile(employee);

        // Only redirect if status is null and we're not already on setup-account page
        if (
          employee.status === null &&
          window.location.pathname !== "/setup-account"
        ) {
          router.push("/setup-account");
        }
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };
  useEffect(() => {
    if (userResponse && userResponse?.user_metadata.role !== "admin") {
      getEmployee();
    }
  }, [userResponse]);

  useEffect(() => {
    if (userResponse) {
      setUser(userResponse);
    }
  }, [userResponse]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    router.replace("/error");
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
