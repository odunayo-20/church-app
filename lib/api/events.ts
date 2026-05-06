import apiClient from "@/lib/api-client";
import type { Event, Rsvp } from "@/types/models";
import type { ApiResponse, PaginatedResult } from "@/types/api";

export async function getEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  upcoming?: boolean;
}) {
  const { data } = await apiClient.get<ApiResponse<PaginatedResult<Event>>>(
    "/api/events",
    { params },
  );
  return data;
}

export async function getEventById(id: string) {
  const { data } = await apiClient.get<ApiResponse<Event>>(`/api/events/${id}`);
  return data;
}

export async function createEvent(input: {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  rsvpEnabled?: boolean;
  rsvpLimit?: number | null;
}) {
  const { data } = await apiClient.post<ApiResponse<Event>>(
    "/api/events",
    input,
  );
  return data;
}

export async function updateEvent(
  id: string,
  input: Partial<{
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl: string;
    rsvpEnabled: boolean;
    rsvpLimit: number | null;
  }>,
) {
  const { data } = await apiClient.patch<ApiResponse<Event>>(
    `/api/events/${id}`,
    input,
  );
  return data;
}

export async function deleteEvent(id: string) {
  const { data } = await apiClient.delete<ApiResponse<unknown>>(
    `/api/events/${id}`,
  );
  return data;
}

export async function submitRsvp(
  eventId: string,
  input: { name: string; email: string; guests: number },
) {
  const { data } = await apiClient.post<ApiResponse<Rsvp>>(
    `/api/events/${eventId}/rsvp`,
    input,
  );
  return data;
}
