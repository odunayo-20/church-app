import apiClient from "@/lib/api-client";
import type { Donation } from "@/types/models";
import type { ApiResponse, PaginatedResult } from "@/types/api";

export async function getDonations(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data } = await apiClient.get<ApiResponse<PaginatedResult<Donation>>>(
    "/api/donations",
    { params },
  );
  return data;
}

export async function getDonationById(id: string) {
  const { data } = await apiClient.get<ApiResponse<Donation>>(
    `/api/donations/${id}`,
  );
  return data;
}

export async function createDonation(input: {
  amount: number;
  reference: string;
  memberId?: string;
  donorName?: string;
  donorEmail?: string;
  status?: "pending" | "completed" | "failed" | "refunded";
}) {
  const { data } = await apiClient.post<ApiResponse<Donation>>(
    "/api/donations",
    input,
  );
  return data;
}

export async function initializeDonation(input: {
  amount: number;
  donorName: string;
  donorEmail: string;
  memberId?: string;
}) {
  const { data } = await apiClient.put<
    ApiResponse<{
      authorizationUrl: string;
      accessCode: string;
      reference: string;
      donationId: string;
    }>
  >("/api/donations", input);
  return data;
}

export async function verifyDonation(reference: string) {
  const { data } = await apiClient.get<ApiResponse<Donation>>(
    `/api/donations/verify`,
    { params: { reference } },
  );
  return data;
}

export async function updateDonation(
  id: string,
  input: Partial<{
    amount: number;
    reference: string;
    memberId: string;
    donorName: string;
    donorEmail: string;
    status: "pending" | "completed" | "failed" | "refunded";
  }>,
) {
  const { data } = await apiClient.patch<ApiResponse<Donation>>(
    `/api/donations/${id}`,
    input,
  );
  return data;
}

export async function deleteDonation(id: string) {
  const { data } = await apiClient.delete<ApiResponse<unknown>>(
    `/api/donations/${id}`,
  );
  return data;
}
