"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardDataAction() {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      { count: memberCount },
      { count: donationCount },
      { count: eventCount },
      { count: postCount },
      { count: rsvpCount },
      { data: monthlyDonations },
      { data: recentDonationsRaw },
      { data: upcomingEventsRaw },
    ] = await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("events").select("*", { count: "exact", head: true }).gte("date", now),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("rsvps").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("paidAt, amount").eq("status", "completed").gte("paidAt", startOfMonth.toISOString()).order("paidAt", { ascending: true }),
      supabase.from("donations").select("*, member:members(name)").eq("status", "completed").order("paidAt", { ascending: false }).limit(5),
      supabase.from("events").select("*").gte("date", now).order("date", { ascending: true }).limit(5),
    ]);

    return {
      memberCount: memberCount || 0,
      donationCount: donationCount || 0,
      eventCount: eventCount || 0,
      postCount: postCount || 0,
      rsvpCount: rsvpCount || 0,
      monthlyDonations: monthlyDonations || [],
      recentDonations: recentDonationsRaw || [],
      upcomingEvents: upcomingEventsRaw || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}
