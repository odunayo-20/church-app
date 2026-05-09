"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { eventSchema, eventUpdateSchema, rsvpSchema, type EventInput, type RsvpInput } from "@/lib/validations";
import type { Event, Rsvp } from "@/types/models";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

export async function getEventsAction(params: PaginationParams & { upcoming?: boolean }): Promise<PaginatedResult<Event>> {
  try {
    const supabase = await createAdminClient();
    const result = await paginate<Event>("events", params, {
      supabase,
      select: "*, rsvps(id)",
      filters: (query) => {
        if (params.upcoming) {
          return query.gte("date", new Date().toISOString());
        }
        return query;
      },
      orderBy: { column: "date", ascending: true },
    });
    // Map rsvps array to _count shape expected by the UI
    return {
      ...result,
      data: result.data.map((event: any) => ({
        ...event,
        _count: { rsvps: Array.isArray(event.rsvps) ? event.rsvps.length : 0 },
        rsvps: undefined,
      })),
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
}

export async function getEventByIdAction(id: string): Promise<Event> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("events")
      .select("*, rsvps(id)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Event not found");

    // Map rsvps array to _count shape
    return {
      ...data,
      _count: { rsvps: Array.isArray(data.rsvps) ? data.rsvps.length : 0 },
    };
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw new Error("Failed to fetch event");
  }
}

export async function createEventAction(data: EventInput): Promise<Event> {
  try {
    const validatedData = eventSchema.parse(data);
    const supabase = await createAdminClient();

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        id: generateId(),
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        location: validatedData.location,
        imageUrl: validatedData.imageUrl || null,
        rsvpEnabled: validatedData.rsvpEnabled ?? false,
        rsvpLimit: validatedData.rsvpLimit ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEventAction(id: string, data: Partial<EventInput>): Promise<Event> {
  try {
    const validatedData = eventUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    const updateData: Record<string, any> = {};

    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.date !== undefined) updateData.date = validatedData.date;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl || null;
    if (validatedData.rsvpEnabled !== undefined) updateData.rsvpEnabled = validatedData.rsvpEnabled;
    if (validatedData.rsvpLimit !== undefined) updateData.rsvpLimit = validatedData.rsvpLimit ?? null;
    
    updateData.updatedAt = new Date().toISOString();

    const { data: event, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/events");
    return event;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function deleteEventAction(id: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event");
  }
}

export async function submitRsvpAction(eventId: string, data: RsvpInput): Promise<Rsvp> {
  try {
    const validatedData = rsvpSchema.parse(data);
    const supabase = await createAdminClient(); 

    const { data: rsvp, error } = await supabase
      .from("rsvps")
      .insert({
        id: generateId(),
        eventId: eventId,
        name: validatedData.name,
        email: validatedData.email,
        guests: validatedData.guests,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath(`/events/${eventId}`);
    return rsvp;
  } catch (error) {
    console.error("Error RSVPing to event:", error);
    throw error;
  }
}

export async function getRsvpsAction(params: PaginationParams & { eventId?: string }): Promise<PaginatedResult<Rsvp & { event: { title: string } }>> {
  try {
    const supabase = await createAdminClient();
    return await paginate<Rsvp & { event: { title: string } }>("rsvps", params, {
      supabase,
      select: "*, event:events(title)",
      filters: (query) => {
        if (params.eventId) {
          return query.eq("eventId", params.eventId);
        }
        return query;
      },
      orderBy: { column: "createdAt", ascending: false },
    });
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    throw new Error("Failed to fetch RSVPs");
  }
}

export async function updateRsvpStatusAction(id: string, status: Rsvp["status"]): Promise<Rsvp> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("rsvps")
      .update({ status, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    // Get eventId to revalidate
    if (data?.eventId) {
      revalidatePath(`/events/${data.eventId}`);
      revalidatePath("/admin/events");
    }
    revalidatePath("/admin/rsvps");
    
    return data;
  } catch (error) {
    console.error(`Error updating RSVP ${id}:`, error);
    throw new Error("Failed to update RSVP status");
  }
}

export async function deleteRsvpAction(id: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient();
    
    // Get info before deleting for revalidation
    const { data: rsvp } = await supabase.from("rsvps").select("eventId").eq("id", id).single();
    
    const { error } = await supabase.from("rsvps").delete().eq("id", id);
    if (error) throw error;

    if (rsvp?.eventId) {
      revalidatePath(`/events/${rsvp.eventId}`);
      revalidatePath("/admin/events");
    }
    revalidatePath("/admin/rsvps");
    
    return true;
  } catch (error) {
    console.error(`Error deleting RSVP ${id}:`, error);
    throw new Error("Failed to delete RSVP");
  }
}
