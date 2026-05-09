import { redirect } from "next/navigation";
import { getCurrentUser, signOut } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Heart,
  HandCoins,
  LogOut,
  ArrowRight,
  User,
  ShieldCheck,
} from "lucide-react";

const quickLinks = [
  { label: "Upcoming Events", href: "/events", icon: Calendar, gradient: "from-amber-500 to-orange-400", description: "View and RSVP to church events" },
  { label: "Sermon Library", href: "/sermons", icon: BookOpen, gradient: "from-rose-500 to-pink-400", description: "Watch and listen to messages" },
  { label: "Prayer Requests", href: "/prayer-request", icon: Heart, gradient: "from-red-500 to-rose-400", description: "Share a prayer request with us" },
  { label: "Give Online", href: "/donate", icon: HandCoins, gradient: "from-emerald-500 to-teal-400", description: "Support the church mission" },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isAdmin = user.role === "admin" || user.role === "media";
  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "GC";

  return (
    <div className="flex flex-col">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-slate-950 py-14 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(38,100%,50%,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(355,100%,65%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Welcome */}
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-xl font-black text-white shadow-lg shadow-amber-500/30">
                {initials}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Member Dashboard</p>
                <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                  Welcome back! 👋
                </h1>
                <p className="mt-0.5 text-sm text-white/50">{user.email}</p>
              </div>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="bg-background py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">

            {/* Quick Links Grid */}
            <div className="lg:col-span-2">
              <p className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Access</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    id={`dashboard-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/40 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${link.gradient} shadow-md`}>
                      <link.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{link.label}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-amber-500" />
                  </Link>
                ))}
              </div>

              {/* Admin CTA */}
              {isAdmin && (
                <Link
                  href="/admin"
                  id="dashboard-admin-link"
                  className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-rose-500/10 p-5 transition-all hover:border-amber-500/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Admin Panel</p>
                    <p className="text-sm text-muted-foreground">Manage content, events, and members</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-500" />
                </Link>
              )}
            </div>

            {/* Account Panel */}
            <div className="space-y-6">
              {/* Account info card */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Account</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
                    <User className="h-4 w-4 shrink-0 text-amber-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="truncate text-sm font-semibold">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-semibold capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Sign out */}
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                    redirect("/auth/login");
                  }}
                  className="mt-5"
                >
                  <button
                    id="dashboard-signout"
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/40 bg-background px-4 py-3 text-sm font-semibold text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </form>
              </div>

              {/* Scripture card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-amber-500/15 p-6">
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
                <Heart className="mb-3 h-6 w-6 text-amber-500" />
                <p className="text-sm italic leading-relaxed text-foreground/70">
                  &ldquo;For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.&rdquo;
                </p>
                <p className="mt-3 text-xs font-bold text-amber-500">— Jeremiah 29:11</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
