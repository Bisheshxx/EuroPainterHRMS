"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useGetUser from "@/Hooks/use-user";
import { UserProvider } from "@/context/user/Provider";
import { createClient } from "../../utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { CreateProfileDialog } from "./ProfilePage/Profile/CreateProfileDialog";
import useUserStore from "@/store";
import { useRouter } from "next/navigation";

interface UserContextType {
  user: any;
  isLoading: boolean;
  error: any;
}

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <UserProvider>{children}</UserProvider>
    </NextThemesProvider>
  );
}
