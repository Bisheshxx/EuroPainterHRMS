"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  Users,
  UserCircle,
  Settings,
  LucideIcon,
  User,
  CircleDollarSign,
} from "lucide-react";
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
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user/Provider";

export function SidebarNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const user = useContext(UserContext);
  const [navigationItems, setNavigationItems] = useState<
    {
      name: string;
      href: string;
      icon: LucideIcon;
    }[]
  >([]);

  useEffect(() => {
    const isAdmin = user?.user_metadata?.role === "admin";
    if (isAdmin) {
      setNavigationItems([
        {
          name: "Home",
          href: "/",
          icon: Home,
        },
        {
          name: "Payroll",
          href: "/payroll",
          icon: CircleDollarSign,
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
      ]);
    }
    if (!isAdmin) {
      setNavigationItems([
        {
          name: "Timesheet",
          href: "/timesheet",
          icon: Clock,
        },
        {
          name: "Profile",
          href: "/profile",
          icon: User,
        },
      ]);
    }
  }, [user?.user_metadata?.role]);

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
                <p className="text-sm font-medium">
                  {user?.user_metadata?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.user_metadata?.role === "admin" ? "Admin" : "Employee"}
                </p>
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
              {
                // Get the last non-empty segment of the path, capitalize it, or show "Home" for "/"
                (() => {
                  const segments = pathname.split("/").filter(Boolean);
                  if (segments.length === 0) return "Home";
                  const last = segments[segments.length - 1];
                  return last.charAt(0).toUpperCase() + last.slice(1);
                })()
              }
            </h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
