import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { MemberEditForm } from "@/components/members/member-edit-form";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Member</h1>
        <p className="mt-1 text-muted-foreground">Update member information</p>
      </div>

      <div className="rounded-lg border border-border/40 bg-card p-6 shadow-sm">
        <MemberEditForm
          member={{
            id: member.id,
            name: member.name,
            email: member.email,
            phone: member.phone,
            birthday: member.birthday,
            anniversary: member.anniversary,
          }}
        />
      </div>
    </div>
  );
}
