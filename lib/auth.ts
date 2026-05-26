import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "media" | "member";

export interface AuthUser {
  id: string;
  email: string | undefined;
  role: UserRole;
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("userId", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    role: (profile?.role as UserRole) || "member",
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

export async function isMedia(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "media";
}

export async function isStaff(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin" || user?.role === "media";
}

export async function signUp(
  email: string,
  password: string,
  profile?: { name?: string; phone?: string; birthday?: string }
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: profile?.name || email.split("@")[0],
        phone: profile?.phone || null,
        birthday: profile?.birthday || null,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    const userId = data.user.id;
    const memberName = profile?.name || email.split("@")[0];

    // Create auth profile row
    await supabase.from("profiles").insert({
      userId,
      email: data.user.email || "",
      role: "member",
    });

    // Create/link member record
    try {
      const { createAdminClient } = await import("@/lib/supabase/server");
      const adminClient = await createAdminClient();

      // If admin already added this person by email, just link their account
      const { data: existing } = await adminClient
        .from("members")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        await adminClient
          .from("members")
          .update({ user_id: userId })
          .eq("id", existing.id);
      } else {
        await adminClient.from("members").insert({
          id: globalThis.crypto.randomUUID(),
          name: memberName,
          email: data.user.email || email,
          phone: profile?.phone || null,
          birthday: profile?.birthday || null,
          user_id: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Fire welcome email (non-blocking)
      import("@/lib/email")
        .then(({ sendEmail }) =>
          import("@/lib/email-templates").then(({ welcomeEmail }) => {
            const tmpl = welcomeEmail(memberName);
            sendEmail({ to: email, subject: tmpl.subject, html: tmpl.html });
          })
        )
        .catch(console.error);
    } catch (memberErr) {
      // Non-fatal — auth succeeded, member row creation failed
      console.error("Failed to create member record:", memberErr);
    }
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
