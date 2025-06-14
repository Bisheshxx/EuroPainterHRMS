"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import useSupabase from "../../Hooks/use-supabase";
import { UserResponse } from "@supabase/supabase-js";

interface UserContextType {
  user: UserResponse | null;
  setUser: React.Dispatch<React.SetStateAction<UserResponse | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const { getUser } = useSupabase();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser();
      if (response?.data) setUser(response);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
