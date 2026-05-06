import { z } from "zod";

const dateSchema = z
  .string()
  .datetime()
  .or(z.date())
  .transform((val) => new Date(val));

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().or(z.literal("")),
  birthday: dateSchema.optional().nullable(),
  anniversary: dateSchema.optional().nullable(),
});

export const donationSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .max(99999999.99),
  status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  reference: z.string().min(1, "Reference is required").max(100),
  memberId: z
    .string()
    .min(1, "Member is required")
    .optional()
    .or(z.literal("")),
  donorName: z.string().min(1, "Name is required").max(100).optional(),
  donorEmail: z.string().email("Invalid email address").optional(),
});

export const donationInitSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .max(99999999.99),
  donorName: z.string().min(1, "Name is required").max(100),
  donorEmail: z.string().email("Invalid email address"),
  memberId: z.string().min(1).optional().or(z.literal("")),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).optional(),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  coverImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  published: z.boolean().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  date: dateSchema,
  location: z.string().min(1, "Location is required").max(200),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  rsvpEnabled: z.boolean().optional(),
  rsvpLimit: z.coerce.number().int().positive().optional().nullable(),
});

export const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  guests: z.coerce.number().int().min(1).max(10).default(1),
});

export const memberUpdateSchema = memberSchema.partial();
export const donationUpdateSchema = donationSchema.partial();
export const postUpdateSchema = postSchema.partial();
export const eventUpdateSchema = eventSchema.partial();

export type MemberInput = z.infer<typeof memberSchema>;
export type DonationInput = z.infer<typeof donationSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
