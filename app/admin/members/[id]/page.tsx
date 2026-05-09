"use client";

import { useMember } from "@/hooks";
import { MemberEditForm } from "@/components/members/member-edit-form";
import { useParams } from "next/navigation";

export default function EditMemberPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: member, isLoading, error } = useMember(id);

  if (isLoading) {
    return <div className="py-12 text-center">Loading member...</div>;
  }

  if (error || !member) {
    return <div className="py-12 text-center text-red-500">Member not found</div>;
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
