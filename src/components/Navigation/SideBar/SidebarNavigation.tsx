"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Users, UserCircle, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Timesheet",
    href: "/timesheet",
    icon: Clock,
  },
  {
    name: "Customer",
    href: "/customer",
    icon: Users,
  },
  {
    name: "Employee",
    href: "/employee",
    icon: UserCircle,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function SidebarNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center space-x-2 group-data-[collapsible=icon]:justify-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">C</span>
            </div>
            <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
              Euro-Paints
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map(item => {
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.name}
                  >
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:sr-only">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center space-x-2 group-data-[collapsible=icon]:space-x-0">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-gray-700">JD</span>
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <h1 className="text-lg font-semibold capitalize">
              {pathname.split("/")}
            </h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
