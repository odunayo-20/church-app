import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/ui/page-header";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our church. We would love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Contact Us"
        description="Have a question or just want to say hello? We would love to hear from you."
        accent="Get In Touch"
      />

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight">
                Send us a Message
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </div>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <Card className="border-none bg-primary/5 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-5 w-5 text-primary" />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  123 Grace Avenue, <br />
                  Central District, <br />
                  Lagos, Nigeria
                </p>
                <div className="mt-6 h-48 w-full overflow-hidden rounded-lg bg-muted">
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground italic">
                    Map integration placeholder
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Service Times
              </h3>
              <div className="space-y-3 rounded-xl border border-border/40 p-5">
                {serviceTimes.map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between items-center border-b border-border/40 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-medium">{item.day}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reach Out Directly</h3>
              <div className="space-y-4">
                <a
                  href="tel:+2348001234567"
                  className="group flex items-center gap-4 transition-colors hover:text-primary"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Phone
                    </p>
                    <p className="font-medium">+234 800 123 4567</p>
                  </div>
                </a>
                <a
                  href="mailto:hello@gracecommunity.org"
                  className="group flex items-center gap-4 transition-colors hover:text-primary"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Email
                    </p>
                    <p className="font-medium">hello@gracecommunity.org</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const serviceTimes = [
  {
    day: "Sunday Worship",
    time: "9:00 AM - 11:30 AM",
  },
  {
    day: "Wednesday Bible Study",
    time: "6:00 PM - 7:30 PM",
  },
  {
    day: "Friday Prayer Meeting",
    time: "6:00 PM - 7:00 PM",
  },
];
