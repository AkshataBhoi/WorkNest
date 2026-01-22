"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

const MotionNav = motion.nav as any;
const MotionDiv = motion.div as any;

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔐 PAGE-BASED UI LOGIC (NO AUTH STATE)
  const isPublicPage =
    pathname === "/" || pathname.startsWith("/login");

  const isDashboardPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workspace");

  return (
    <MotionNav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo variant="gradient" size="md" />
        </Link>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center gap-6">
          {isPublicPage && (
            <Button className="rounded-full px-8 py-5 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/10">
              <Link href="/login">Login</Link>
            </Button>
          )}

          {isDashboardPage && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 gap-2"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          )}
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
        {(isPublicPage || isDashboardPage) && (
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
        )}
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {isPublicPage && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/10">
                    Login
                  </Button>
                </Link>
              )}

              {isDashboardPage && (
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
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionNav>
  );
}
