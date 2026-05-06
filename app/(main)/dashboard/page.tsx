import { redirect } from "next/navigation";
import { getCurrentUser, signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-border/40 bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back, {user.email}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Role: <span className="font-medium capitalize">{user.role}</span>
        </p>

        <form
          action={async () => {
            "use server";
            await signOut();
            redirect("/auth/login");
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
