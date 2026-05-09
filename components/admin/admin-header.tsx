"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/auth";
import { LogOut, Home, ChevronRight, ShieldCheck, User, ChevronDown, Settings, Menu } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";

interface AdminHeaderProps {
  user: AuthUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { toggle } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "AD";
    
  const isAdmin = user.role === "admin" || user.role === "media";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Breadcrumb Area */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <button
          onClick={toggle}
          className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 transition-all hover:bg-amber-500/10 active:scale-95 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-amber-500">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Main Site</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground">Admin Workspace</span>
      </div>

      {/* User Actions Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 rounded-2xl border border-transparent p-1.5 transition-all hover:bg-muted/50 focus:outline-none"
        >
          <div className="hidden text-right sm:block mr-1">
            <p className="text-sm font-semibold leading-none">{user.email}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground flex justify-end items-center gap-1 leading-none">
              {isAdmin ? <ShieldCheck className="h-3 w-3 text-amber-500" /> : <User className="h-3 w-3 text-amber-500" />}
              {user.role}
            </p>
          </div>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-sm font-bold text-white shadow-md">
            {initials}
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-emerald-500 shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-border/40 bg-card shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-2">
              <div className="px-3 py-2 sm:hidden border-b border-border/40 mb-2">
                <p className="truncate text-sm font-semibold">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              
              <Link
                href="/admin/profile"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-amber-500"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Your Profile
              </Link>
              
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-amber-500"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
            
            <div className="border-t border-border/40 p-2">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
