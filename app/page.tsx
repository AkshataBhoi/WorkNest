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
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        <PageTransition>
          {/* Hero Section */}
          <section className="relative overflow-hidden py-24 sm:py-32 lg:pb-40">
            {/* Background Decorations */}
            <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 opacity-20 blur-[100px]" />
            <div className="absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-accent/10 opacity-20 blur-[80px]" />

            <div className="container mx-auto px-4 text-center">
              <MotionDiv
                initial={{ opacity: 0, y: 20 } as any}
                animate={{ opacity: 1, y: 0 } as any}
                transition={{ duration: 0.5 } as any}
              >
                <div className="mx-auto mb-6 flex w-fit items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  The Future of Workspace Management
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                  Manage Workspaces, Teams, <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Responsibilities & Expenses
                  </span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                  A unified platform to organize your projects, track tasks, split costs,
                  and collaborate efficiently - all in one place.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="group min-w-[160px] text-lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg" className="min-w-[160px] text-lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </MotionDiv>
            </div>
          </section>

          {/* New Process Timeline Section */}
          <div id="features">
            <ProcessTimeline />
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
