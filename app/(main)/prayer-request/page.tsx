import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function PrayerRequestPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Prayer Request"
        description="We believe in the power of prayer. Share your requests with us, and our team will pray for you."
        accent="Community Care"
      />

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="h-2 bg-accent" />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Heart className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">
                How can we pray for you?
              </CardTitle>
              <CardDescription>
                Your request will be handled with care and confidentiality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request">Your Prayer Request</Label>
                  <Textarea
                    id="request"
                    placeholder="Tell us what you would like us to pray for..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 rounded-lg border border-border/40 bg-muted/30 p-4">
                  <input
                    type="checkbox"
                    id="anonymous"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="anonymous"
                    className="font-normal text-muted-foreground"
                  >
                    Keep my request anonymous (only shared with the prayer team)
                  </Label>
                </div>

                <Button className="w-full" size="lg">
                  Submit Prayer Request
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  "For where two or three are gathered together in My name, I am
                  there in the midst of them." — Matthew 18:20
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
