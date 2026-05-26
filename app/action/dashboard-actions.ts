"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getDashboardDataAction() {
  try {
    const supabase = await createAdminClient();
    const now = new Date().toISOString();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const results = await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("events").select("*", { count: "exact", head: true }).gte("date", now),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("rsvps").select("*", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("donations").select("paid_at, amount").eq("status", "completed").gte("paid_at", startOfMonth.toISOString()).order("paid_at", { ascending: true }),
      supabase.from("donations").select("*, member:members(name)").eq("status", "completed").order("paid_at", { ascending: false }).limit(5),
      supabase.from("events").select("*").gte("date", now).order("date", { ascending: true }).limit(5),
      supabase.from("donations").select("amount").eq("status", "completed"),
    ]);

    results.forEach((res, index) => {
      if (res.error) {
        console.error(`Dashboard query ${index} failed:`, res.error);
      }
    });

    const [
      { count: memberCount },
      { count: donationCount },
      { count: eventCount },
      { count: postCount },
      { count: rsvpCount },
      { count: subscriberCount },
      { data: monthlyDonations },
      { data: recentDonationsRaw },
      { data: upcomingEventsRaw },
      { data: totalAmountData },
    ] = results;

    const totalDonationAmount = (totalAmountData || []).reduce((sum, d) => sum + Number(d.amount), 0);

    return {
      memberCount: memberCount || 0,
      donationCount: donationCount || 0,
      totalDonationAmount,
      eventCount: eventCount || 0,
      postCount: postCount || 0,
      rsvpCount: rsvpCount || 0,
      subscriberCount: subscriberCount || 0,
      monthlyDonations: (monthlyDonations || []).map(d => ({ ...d, paidAt: d.paid_at })),
      recentDonations: (recentDonationsRaw || []).map(d => ({ ...d, paidAt: d.paid_at })),
      upcomingEvents: upcomingEventsRaw || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}
