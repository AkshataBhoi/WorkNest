"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { ArrowRight, LayoutDashboard, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { ProcessTimeline } from "@/components/landing/ProcessTimeline";
import PremiumBackground from "@/components/landing/PremiumBackground";
import HeroVisual from "@/components/landing/HeroVisual";

const MotionDiv = motion.div as any;

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-white selection:bg-primary/30">
      <PremiumBackground />
      <Navbar />

      <main className="flex-1 relative">
        <PageTransition>
          {/* Hero Section */}
          <section className="relative p-4 sm:p-6 md:p-10 mb-6 sm:mb-10 lg:mb-10">
            <div className="container mx-auto px-4 sm:px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                <MotionDiv
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-left"
                >
                  <div className="mb-4 sm:mb-6 lg:mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium text-primary shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    The Future of Workspace Management
                  </div>

                  <h1 className="mb-4 sm:mb-6 lg:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                    Manage <br />
                    <span className="text-white">Workspaces</span>, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-cyan-400">
                      Responsibilities
                    </span> <br />
                    & Expenses.
                  </h1>

                  <p className="mb-6 sm:mb-8 lg:mb-12 max-w-xl text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 leading-relaxed">
                    A unified platform to organize your projects, track tasks, split costs,
                    and collaborate efficiently - all in one unified, high-performance workspace.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <Link href="/signup" className="w-full sm:w-auto">
                      <Button size="lg" className="group w-full sm:w-auto rounded-full px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg font-bold bg-gradient-to-r from-primary/60 to-purple-500/80 shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="#features" className="w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg font-semibold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                  className="hidden lg:block relative"
                >
                  <HeroVisual />
                </MotionDiv>
              </div>
            </div>
          </section>

          {/* New Process Timeline Section */}
          <div id="features" className="relative z-10">
            <ProcessTimeline />
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
