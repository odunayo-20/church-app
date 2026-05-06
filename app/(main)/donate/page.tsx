import { DonationForm } from "@/components/donations/donation-form";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function DonatePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Support Our Mission"
        description="Your generosity enables us to serve our community, support those in need, and share the message of hope."
        accent="Giving"
      />

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Why Your Giving Matters
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                When you give to Grace Community, you're not just supporting a
                building; you're investing in lives transformed by the power of
                God.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-none bg-muted/50 shadow-none">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <ShieldCheck className="h-10 w-10 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold">Secure & Transparent</h4>
                    <p className="text-sm text-muted-foreground">
                      All donations are processed securely through
                      industry-leading payment gateways. We provide annual
                      contribution statements for your records.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden border-none shadow-2xl lg:sticky lg:top-24">
            <div className="h-2 bg-primary" />
            <CardHeader>
              <CardTitle>Enter Donation Amount</CardTitle>
              <CardDescription>
                Choose a predefined amount or enter a custom value.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DonationForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

const benefits = [
  {
    title: "Community Outreach",
    description: "Feeding programs and local community support initiatives.",
    icon: Heart,
  },
  {
    title: "Youth & Kids",
    description: "Developing the next generation through faith-based programs.",
    icon: Sparkles,
  },
  {
    title: "Missions",
    description:
      "Supporting global outreach and spreading the gospel worldwide.",
    icon: ShieldCheck,
  },
  {
    title: "Church Growth",
    description: "Enhancing our worship experience and facility maintenance.",
    icon: Sparkles,
  },
];
