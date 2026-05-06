import type { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Prayer", href: "/prayer-request" },
  { label: "Contact", href: "/contact" },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];
