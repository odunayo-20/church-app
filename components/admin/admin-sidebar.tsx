"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, Users, CreditCard, Calendar, 
  FileText, Bell, Globe, Menu, X, Church, Video, Heart, Images, Mail, Send
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", roles: ["admin", "media"], icon: LayoutDashboard },
  { label: "Members", href: "/admin/members", roles: ["admin"], icon: Users },
  { label: "Media Library", href: "/admin/media", roles: ["admin", "media"], icon: Images },
  { label: "Messages", href: "/admin/contacts", roles: ["admin", "media"], icon: Mail },
  { label: "Prayer Requests", href: "/admin/prayer-requests", roles: ["admin", "media"], icon: Heart },
  { label: "Sermons", href: "/admin/sermons", roles: ["admin", "media"], icon: Video },
  { label: "Donations", href: "/admin/donations", roles: ["admin"], icon: CreditCard },
  { label: "Events", href: "/admin/events", roles: ["admin", "media"], icon: Calendar },
  { label: "RSVPs", href: "/admin/rsvps", roles: ["admin", "media"], icon: Globe },
  { label: "Blog Posts", href: "/admin/blog", roles: ["admin", "media"], icon: FileText },
  { label: "Newsletters", href: "/admin/newsletters", roles: ["admin"], icon: Send },
  { label: "Notifications", href: "/admin/notifications", roles: ["admin", "media"], icon: Bell },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();
  const { role } = useAuth();

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(role as string),
  );

  return (
    <>


      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/40 bg-slate-950 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-radial-gradient(ellipse_at_top_left,hsl(38,100%,50%,0.08) bg-transparent_50%)" />
        
        <div className="relative flex h-full flex-col z-10">
          {/* Brand */}
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 shadow-md">
              <Church className="h-4 w-4 text-white" />
            </div>
            <Link href="/admin" className="text-lg font-bold text-white tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || "Grace Community"}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <div className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-white/40">
              Manage
            </div>
            {filteredItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500/15 text-amber-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-amber-400" : "text-white/40 group-hover:text-white/70"}`} />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Area */}
          <div className="border-t border-white/10 p-4 bg-white/5">
            <Link
              href="/"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <Globe className="h-4 w-4 text-white/40 group-hover:text-white/70" />
              View Live Site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
