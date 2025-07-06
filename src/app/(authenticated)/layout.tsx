"use client";
import { SidebarNavigation } from "@/components/Navigation/SideBar/SidebarNavigation";
import { UserProvider } from "@/context/user/Provider";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <SidebarNavigation>{children}</SidebarNavigation>
    </UserProvider>
  );
}
