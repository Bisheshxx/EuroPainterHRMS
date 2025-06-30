import { SidebarNavigation } from "@/components/Navigation/SideBar/SidebarNavigation";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <SidebarNavigation>{children}</SidebarNavigation>
    </div>
  );
}
