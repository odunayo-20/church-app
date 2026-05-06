import prisma from "@/lib/prisma";
import type { DonationInput } from "@/lib/validations";
import { paginate, type PaginationParams } from "@/lib/db-service";

export async function getDonations(params: PaginationParams) {
  return paginate("donation", params);
}

export async function getDonationById(id: string) {
  return prisma.donation.findUnique({
    where: { id },
    include: { member: true },
  });
}

export async function getDonationByReference(reference: string) {
  return prisma.donation.findUnique({
    where: { reference },
    include: { member: true },
  });
}

export async function createDonation(data: DonationInput) {
  return prisma.donation.create({
    data: {
      amount: data.amount,
      reference: data.reference,
      status: data.status ?? "pending",
      memberId: data.memberId || null,
      donorName: data.donorName ?? null,
      donorEmail: data.donorEmail ?? null,
    },
  });
}

export async function updateDonationStatus(
  reference: string,
  status: "completed" | "failed" | "refunded",
  gatewayData?: {
    gatewayReference?: string;
    paymentMethod?: string;
    channel?: string;
    paidAt?: Date;
    metadata?: Record<string, unknown>;
  },
) {
  const { metadata, ...rest } = gatewayData ?? {};
  return prisma.donation.update({
    where: { reference },
    data: {
      status,
      ...rest,
      ...(metadata && { metadata: metadata as object }),
    },
  });
}

export async function updateDonation(id: string, data: Partial<DonationInput>) {
  return prisma.donation.update({
    where: { id },
    data,
  });
}

export async function deleteDonation(id: string) {
  return prisma.donation.delete({
    where: { id },
  });
}
