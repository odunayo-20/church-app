import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    memberCount,
    donationCount,
    eventCount,
    postCount,
    monthlyDonations,
    recentDonations,
    upcomingEvents,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.donation.count({ where: { status: "completed" } }),
    prisma.event.count({ where: { date: { gte: now } } }),
    prisma.post.count({ where: { published: true } }),
    prisma.donation.findMany({
      where: { status: "completed", paidAt: { gte: startOfMonth } },
      orderBy: { paidAt: "asc" },
      select: { paidAt: true, amount: true },
    }),
    prisma.donation.findMany({
      where: { status: "completed" },
      orderBy: { paidAt: "desc" },
      take: 5,
      include: { member: true },
    }),
    prisma.event.findMany({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ]);

  const totalDonations = monthlyDonations.reduce(
    (sum, d) => sum + Number(d.amount),
    0,
  );

  const chartData = monthlyDonations.map((d) => ({
    date: formatDate(d.paidAt!.toString()),
    amount: Number(d.amount),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your church management system
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={memberCount}
          href="/admin/members"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Donations"
          value={donationCount}
          href="/admin/donations"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Upcoming Events"
          value={eventCount}
          href="/admin/events"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Published Posts"
          value={postCount}
          href="/admin/blog"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts data={chartData} total={totalDonations} />
        </div>
        <UpcomingEventsList events={upcomingEvents} />
      </div>

      <RecentDonationsList donations={recentDonations} />
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
  icon,
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-border/40 bg-card p-6 shadow-sm transition-colors hover:bg-accent/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-2xl font-bold">{value.toLocaleString()}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{title}</p>
    </Link>
  );
}

function UpcomingEventsList({
  events,
}: {
  events: { id: string; title: string; date: Date; location: string }[];
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 p-6">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <Link
          href="/admin/events"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No upcoming events
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-4">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">
                <span className="text-xs font-medium uppercase text-primary">
                  {new Date(event.date).toLocaleString("default", {
                    month: "short",
                  })}
                </span>
                <span className="text-lg font-bold">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentDonationsList({
  donations,
}: {
  donations: {
    id: string;
    amount: unknown;
    paidAt: Date | null;
    donorName: string | null;
    member: { name: string | null } | null;
  }[];
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 p-6">
        <h2 className="text-lg font-semibold">Recent Donations</h2>
        <Link
          href="/admin/donations"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {donations.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No donations yet
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {(donation.member?.name || donation.donorName || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {donation.member?.name || donation.donorName || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {donation.paidAt
                      ? formatDate(donation.paidAt.toISOString())
                      : "Pending"}
                  </p>
                </div>
              </div>
              <span className="font-medium">
                ₦{Number(donation.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
