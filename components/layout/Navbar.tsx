"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

const MotionNav = motion.nav as any;
const MotionDiv = motion.div as any;

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth();
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
          {isLoading ? (
            // Loading State - Render nothing or a skeleton to prevent flicker
            <div className="w-[100px] h-10" />
          ) : !isAuthenticated ? (
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </div>
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
              {isLoading ? (
                <div className="w-full h-12 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : !isAuthenticated ? (
                <>
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
                <div className="py-2 flex flex-col gap-4 items-center">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10 gap-2"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </Button>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionNav>
  );
}