"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useUser from "@/components/Providers/UserProvider";
import UserProvider from "@/components/Providers/UserProvider";
import useGetUser from "@/Hooks/use-user";

interface UserContextType {
  user: any;
  isLoading: boolean;
  error: any;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  // const { userContext } = useUser();
  useGetUser();
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
