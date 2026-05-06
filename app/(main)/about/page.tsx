import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about our church, our mission, our values, and our community.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          About Our Church
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Welcome to our church family. We are a community of believers
          dedicated to spreading love, hope, and the Word of God.
        </p>
      </section>

      <section className="mb-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Our Mission</h2>
          <p className="mt-4 text-muted-foreground">
            Our mission is to lead people into a growing relationship with Jesus
            Christ. We believe in building a community where everyone is
            welcome, everyone belongs, and everyone has the opportunity to grow
            in faith.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Our Vision</h2>
          <p className="mt-4 text-muted-foreground">
            We envision a church that transforms lives, strengthens families,
            and impacts communities through the power of the Gospel. We strive
            to be a beacon of hope in our city and beyond.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight">Our Values</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-border/40 bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-medium">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Our Leadership
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((leader) => (
            <div
              key={leader.name}
              className="rounded-lg border border-border/40 bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {leader.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-lg font-medium">{leader.name}</h3>
              <p className="text-sm text-primary">{leader.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{leader.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Join Us This Sunday
        </h2>
        <p className="mt-2 text-muted-foreground">
          We would love to have you worship with us. Service times and location
          details are available on our events page.
        </p>
      </section>
    </div>
  );
}

const values = [
  {
    title: "Faith",
    description:
      "We believe in the power of faith and trust in God to guide our lives and decisions.",
  },
  {
    title: "Community",
    description:
      "We are committed to building strong, supportive relationships within our church family.",
  },
  {
    title: "Service",
    description:
      "We serve others with love, compassion, and a heart for those in need.",
  },
  {
    title: "Worship",
    description:
      "We worship God with passion, authenticity, and reverence in all that we do.",
  },
  {
    title: "Growth",
    description:
      "We encourage spiritual growth through study, prayer, and fellowship.",
  },
  {
    title: "Outreach",
    description:
      "We reach beyond our walls to share the Gospel and make a difference in our community.",
  },
];

const leadership = [
  {
    name: "Pastor John Doe",
    role: "Senior Pastor",
    bio: "Pastor John has been leading our congregation for over 15 years with a heart for teaching and discipleship.",
  },
  {
    name: "Pastor Jane Smith",
    role: "Associate Pastor",
    bio: "Pastor Jane oversees our youth ministry and women's programs with passion and dedication.",
  },
  {
    name: "Elder Michael Brown",
    role: "Church Administrator",
    bio: "Elder Michael manages the day-to-day operations and ensures our church runs smoothly.",
  },
];
