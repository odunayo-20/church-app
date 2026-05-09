export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  birthday: string | null;
  anniversary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  reference: string;
  memberId: string | null;
  gateway: string;
  gatewayReference: string | null;
  paymentMethod: string | null;
  channel: string | null;
  metadata: Record<string, unknown> | null;
  donorName: string | null;
  donorEmail: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  member?: Member;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string | null;
  rsvpEnabled: boolean;
  rsvpLimit: number | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    rsvps: number;
  };
}

export interface Rsvp {
  id: string;
  eventId: string;
  name: string;
  email: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
export interface Profile {
  id: string;
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "admin" | "media" | "member";
  createdAt: string;
  updatedAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  speaker: string;
  sermonDate: string;
  series: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
