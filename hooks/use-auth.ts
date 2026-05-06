"use client";

import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { type UserRole } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("member");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("userId", user.id)
          .single();

        if (profile) {
          setRole(profile.role as UserRole);
        }
      } else {
        setUser(null);
        setRole("member");
      }
      setLoading(false);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("userId", session.user.id)
          .single();
        if (profile) {
          setRole(profile.role as UserRole);
        }
      } else {
        setRole("member");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { user, role, loading };
}
