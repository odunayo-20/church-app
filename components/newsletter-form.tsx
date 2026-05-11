"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSubscriberSchema } from "@/lib/validations";
import { useSubscribe } from "@/hooks";
import { toast } from "sonner";

export function NewsletterForm() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { mutateAsync: subscribe, isPending } = useSubscribe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsletterSubscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await subscribe(data.email);
      setIsSubscribed(true);
      reset();
      toast.success("Thank you for subscribing!");
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 text-emerald-400 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-medium">You've successfully subscribed!</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        id="footer-newsletter-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full gap-2"
      >
        <div className="relative flex-1">
          <input
            {...register("email")}
            id="footer-newsletter-email"
            type="email"
            placeholder="your@email.com"
            disabled={isPending}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:bg-white/8 ${
              errors.email 
                ? "border-rose-500/50 focus:border-rose-500" 
                : "border-white/10 focus:border-amber-400/50"
            }`}
          />
        </div>
        <button
          id="footer-newsletter-submit"
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:opacity-90 hover:shadow-amber-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
      {errors.email && (
        <p className="mt-2 text-xs text-rose-400 animate-in slide-in-from-top-1 duration-200">
          {errors.email.message as string}
        </p>
        
      )}
    </div>
  );
}
