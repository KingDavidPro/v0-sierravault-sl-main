"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Upload,
  Settings,
  Shield,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/use-toast"

const sidebarLinks = [
  { href: "/dashboard/me", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "My Documents", icon: FileText },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/verify", label: "Verify", icon: HelpCircle },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({
                          userName = "David Conteh",
                          userEmail = "david@example.com",
                          mobileOpen = false,
                          setMobileOpen,
                        }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const { showToast } = useToast();

  // Track window width safely for SSR
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChevronClick = () => {
    if (windowWidth >= 1024) {
      setCollapsed(!collapsed);
    } else {
      setMobileOpen && setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear stored token and user info
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Show success toast
    showToast("success", "Logged Out", "You have been successfully logged out.");

    // Redirect to login
    window.location.href = "/login";
  };

  return (
      <aside
          className={cn(
              "fixed top-0 left-0 z-40 h-screen border-r border-border bg-sidebar transition-width duration-300 ease-in-out",
              collapsed ? "w-24" : "w-64",
              "lg:translate-x-0",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
              "lg:relative"
          )}
      >
        {/* Logo & collapse button */}
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link
              href="/dashboard/me"
              className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  collapsed && "justify-center w-full"
              )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal flex-shrink-0">
              <Shield className="h-5 w-5 text-navy-dark" />
            </div>
            {!collapsed && (
                <span className="text-lg font-bold text-foreground">
              Sierra<span className="text-teal">Vault</span>
            </span>
            )}
          </Link>

          <Button
              variant="ghost"
              size="icon"
              className={cn(
                  "absolute top-1/2 -right-4 z-50 h-8 w-8 -translate-y-1/2 rounded-full border border-border bg-sidebar text-muted-foreground hover:bg-teal hover:text-foreground",
                  collapsed && "rotate-180",
                  "hidden lg:flex transition-transform"
              )}
              onClick={handleChevronClick}
              aria-label="Toggle Sidebar"
              aria-expanded={!collapsed}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile chevron */}
        {collapsed && windowWidth < 1024 && (
            <Button
                variant="ghost"
                size="icon"
                className="mx-auto mt-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen && setMobileOpen(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
        )}

        {/* Scrollable content */}
        <div className="flex flex-col flex-1 overflow-y-auto p-2">
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                  pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                              ? "bg-teal/10 text-teal"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                          collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? link.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                  >
                    <link.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4 flex flex-col items-start justify-end h-[62vh]">
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal flex-shrink-0">
                <span className="text-sm font-semibold text-navy-dark">{userName.charAt(0)}</span>
              </div>
              {!collapsed && (
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{userName}</p>
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                  </div>
              )}
            </div>

            <button
                className={cn(
                    "mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                    collapsed && "justify-center px-2"
                )}
                onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
  );
}
