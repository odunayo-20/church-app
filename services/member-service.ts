import prisma from "@/lib/prisma";
import type { MemberInput } from "@/lib/validations";
import { paginate, type PaginationParams } from "@/lib/db-service";

export async function getMembers(params: PaginationParams) {
  return paginate("member", params);
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: { donations: true },
  });
}

export async function createMember(data: MemberInput) {
  return prisma.member.create({
    data,
  });
}

export async function updateMember(id: string, data: Partial<MemberInput>) {
  return prisma.member.update({
    where: { id },
    data,
  });
}

export async function deleteMember(id: string) {
  return prisma.member.delete({
    where: { id },
  });
}
