"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Church,
  Heart,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-amber-500/50">
              <Church className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[17px] font-bold tracking-tight text-white">
                Grace{" "}
                <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  Community
                </span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Faith · Hope · Love
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.label.toLowerCase()}`}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/auth/login"
              id="nav-signin"
              className="text-sm font-medium text-white/60 transition-colors duration-200 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/donate"
              id="nav-donate"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50"
            >
              <Heart className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              Give Now
            </Link>
          </div>

          {/* Mobile Burger */}
          <button
            id="nav-mobile-toggle"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col bg-slate-950 shadow-2xl lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-rose-500">
                    <Church className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">
                    Grace Community
                  </span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Nav */}
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      id={`mobile-nav-${item.label.toLowerCase()}`}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-amber-500/15 to-rose-500/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive(item.href) ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 opacity-30" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer Actions */}
              <div className="border-t border-white/10 p-4 space-y-3">
                <Link
                  href="/auth/login"
                  id="mobile-nav-signin"
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/donate"
                  id="mobile-nav-donate"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4" />
                  Give Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
