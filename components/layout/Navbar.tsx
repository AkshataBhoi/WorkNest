"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { Menu, X } from "lucide-react";

const MotionNav = motion.nav as any;
const MotionDiv = motion.div as any;

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/workspace");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MotionNav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-12">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo variant="gradient" size="md" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!isDashboard ? (
            <>
              <Button
                // asChild
                className="relative overflow-hidden rounded-full px-8 py-5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-primary/25 active:scale-95 bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/10 backdrop-blur-sm"
              >
                <Link href="/login">
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </>
          ) : (
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-6 hover:bg-white/5 font-semibold text-muted-foreground hover:text-foreground"
              >
                Log Out
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 p-0 rounded-xl hover:bg-white/5"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 space-y-3">
              {!isDashboard ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full relative overflow-hidden rounded-xl px-6 py-5 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/10 backdrop-blur-sm">
                      <span className="relative z-10">Login</span>
                      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant="ghost"
                    className="w-full rounded-xl hover:bg-white/5 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Log Out
                  </Button>
                </Link>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionNav>
  );
}
