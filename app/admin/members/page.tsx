import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { MemberForm } from "@/components/members/member-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

async function deleteMember(formData: FormData) {
  "use server";

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const id = formData.get("id") as string;
  await prisma.member.delete({ where: { id } });
  redirect("/admin/members");
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const members = await prisma.member.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { donations: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Members
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your church members
          </p>
        </div>
        <MemberForm />
      </div>

      <div className="rounded-lg border border-border/40 bg-card shadow-sm">
        <div className="border-b border-border/40 p-4">
          <form>
            <input
              type="text"
              name="search"
              placeholder="Search members..."
              defaultValue={search}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-64"
            />
          </form>
        </div>

        {members.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No members found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium sm:table-cell">
                    Email
                  </th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium md:table-cell">
                    Phone
                  </th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">
                    Donations
                  </th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/25">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-sm sm:table-cell">
                      {member.email}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                      {member.phone || "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-sm lg:table-cell">
                      {member._count.donations}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/members/${member.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <form method="POST" action={deleteMember}>
                          <input type="hidden" name="id" value={member.id} />
                          <DeleteButton message="Are you sure you want to delete this member?" />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
