import Link from "next/link";
import { Church, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { NewsletterForm } from "@/components/newsletter-form";

/* ── Social Icon SVGs ───────────────────────────── */
const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM10.16 15.343l5.524-3.134-5.524-3.134v6.268z" clipRule="evenodd" />
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

/* ── Service Times data ─────────────────────────── */
const serviceTimes = [
  { day: "Sunday Worship", time: "9:00 AM & 11:30 AM" },
  { day: "Wednesday Bible Study", time: "6:00 PM – 7:30 PM" },
  { day: "Friday Prayer Night", time: "6:00 PM – 7:00 PM" },
];

const socialLinks = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Twitter, label: "Twitter / X", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

/* ── Component ──────────────────────────────────── */
export function Footer() {
  const currentYear = new Date().getFullYear();
    const siteName = process.env.NEXT_PUBLIC_APP_NAME || "Grace Community";
    const [nameFirst, nameLast] = siteName.split(" ");

  return (
    <footer className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Top ambient glow */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 -translate-y-1/2 rounded-full bg-amber-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 top-0 h-72 w-72 -translate-y-1/2 rounded-full bg-rose-500/8 blur-[100px]" />

      {/* Newsletter Banner */}
      <div className="relative border-b border-white/8">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Stay Connected
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Get our weekly newsletter
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Sermons, events & community news delivered to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-6">
            <Link href="/" id="footer-logo" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-amber-500/50">
                <Church className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-white">
                  {nameFirst}{" "}
                  <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                    {nameLast || ""}
                  </span>
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Faith · Hope · Love
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-white/50">
              We are a community of faith dedicated to sharing the love of God
              and serving our neighbours. Join us on this journey of
              transformation.
            </p>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all duration-200 hover:border-amber-400/30 hover:bg-amber-400/10 hover:text-amber-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[...NAV_ITEMS, { label: "Donate", href: "/donate" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-1.5 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                >
                  <span className="h-px w-0 bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300 group-hover:w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service Times */}
          <div className="space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Service Times
            </h3>
            <div className="space-y-4">
              {serviceTimes.map(({ day, time }) => (
                <div key={day} className="space-y-0.5">
                  <p className="text-sm font-semibold text-white/90">{day}</p>
                  <p className="text-sm text-amber-400/80">{time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-map-link"
                className="flex gap-3 text-sm text-white/55 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>123 Grace Avenue, Lagos, Nigeria</span>
              </a>
              <a
                href="tel:+2348001234567"
                id="footer-phone-link"
                className="flex gap-3 text-sm text-white/55 transition-colors hover:text-white"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>+234 800 123 4567</span>
              </a>
              <a
                href="mailto:hello@gracecommunity.org"
                id="footer-email-link"
                className="flex gap-3 text-sm text-white/55 transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>hello@gracecommunity.org</span>
              </a>
            </div>

            {/* CTA Block */}
            <div className="mt-6 rounded-xl border border-amber-400/15 bg-gradient-to-br from-amber-500/10 to-rose-500/10 p-4">
              <p className="text-sm font-semibold text-white">Join us Sunday</p>
              <p className="mt-1 text-xs text-white/50">
                First-time visitor? We&apos;d love to meet you.
              </p>
              <Link
                href="/about"
                id="footer-plan-visit"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300"
              >
                Plan Your Visit
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/30 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Made with{" "}
            <Heart className="h-3 w-3 fill-rose-400 text-rose-400" /> for the
            community
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" id="footer-privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" id="footer-terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="/cookies" id="footer-cookies" className="transition-colors hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
