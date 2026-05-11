import { z } from "zod";

const dateSchema = z
  .preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Date is required"
        : "Please select a valid date"
  }));

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().nullable().or(z.literal("")),
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
  image: z.string().optional().nullable().or(z.literal("")),
  coverImage: z.string().optional().nullable().or(z.literal("")),
  published: z.boolean().optional(),
  authorId: z.string().optional().nullable(),
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

export const sermonSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  slug: z.string().min(1, "Slug is required").max(200).optional(),
  description: z.string().max(2000, "Description is too long").optional().or(z.literal("")),
  speaker: z.string().min(1, "Speaker name is required").max(100),
  sermonDate: dateSchema,
  series: z.string().max(100).optional().or(z.literal("")),
  imageUrl: z.string().url("Please provide a valid image URL").optional().or(z.literal("")),
  audioUrl: z.string().url("Please provide a valid audio URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Please provide a valid video URL").optional().or(z.literal("")),
  published: z.boolean().optional(),
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
export const sermonUpdateSchema = sermonSchema.partial();
export const prayerRequestSchema = z.object({
  name: z.string().max(100).optional().nullable().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  request: z.string().min(1, "Prayer request is required").max(2000),
  isAnonymous: z.boolean().default(false),
  status: z.enum(["pending", "prayed", "answered"]).default("pending"),
});
export const prayerRequestUpdateSchema = prayerRequestSchema.partial();

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(2000),
  status: z.enum(["unread", "read", "replied"]).default("unread"),
});
export const contactMessageUpdateSchema = contactMessageSchema.partial();

export const newsletterSubscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  status: z.enum(["active", "unsubscribed"]).default("active"),
});

export const newsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "sent"]).default("draft"),
});

export const newsletterUpdateSchema = newsletterSchema.partial();

export type MemberInput = z.input<typeof memberSchema>;
export type DonationInput = z.infer<typeof donationSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type SermonInput = z.infer<typeof sermonSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
