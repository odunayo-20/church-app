import { type Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export type UserRole = "admin" | "media" | "member";

export interface AuthUser {
  id: string;
  email: string | undefined;
  role: UserRole;
  session: Session;
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

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { role: true },
  });

  return {
    id: user.id,
    email: user.email,
    role: (profile?.role as UserRole) || "member",
    session: (await getSession())!,
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

export async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    await prisma.profile.create({
      data: {
        userId: data.user.id,
        email: data.user.email || "",
        role: "member",
      },
    });
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
