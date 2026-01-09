"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  Key,
  Mail,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionDiv = motion.div as any;

export default function JoinWorkspacePage() {
  const { joinWorkspace } = useWorkspaces();

  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState<"code" | "email">("code");
  const [inviteCode, setInviteCode] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [previewReady, setPreviewReady] = React.useState(false);

  const router = useRouter();

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (inviteCode.toUpperCase().startsWith("WN-")) {
        setPreviewReady(true);
        setTimeout(() => setStep("email"), 700);
      } else {
        setError("Invalid invite code. Please check and try again.");
      }
      setIsLoading(false);
    }, 900);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = joinWorkspace(inviteCode.toUpperCase(), email);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Failed to join workspace. It may no longer exist.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <motion.div
        // animate={{ opacity: [0.4, 0.7, 0.4] }}
        // transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]"
      />

      <main className="container mx-auto max-w-md px-4 py-20 flex items-center justify-center">
        <PageTransition>
          <MotionDiv
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group mb-4"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Join Workspace
              </h1>
              <p className="text-muted-foreground">
                Securely connect with your team using an invite code.
              </p>

              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className={cn("h-2 w-2 rounded-full", step === "code" ? "bg-primary" : "bg-muted")} />
                <span className={cn("h-2 w-2 rounded-full", step === "email" ? "bg-primary" : "bg-muted")} />
              </div>
            </div>

            {/* Card */}
            <Card className="relative border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
              <CardContent className="relative p-8">
                <AnimatePresence mode="wait">
                  {step === "code" ? (
                    <MotionDiv
                      key="code"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <form onSubmit={handleCodeSubmit} className="space-y-6">
                        <div className="text-center space-y-2">
                          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                            <Key className="h-6 w-6 text-primary" />
                          </div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Invite Code
                          </label>

                          <Input
                            required
                            placeholder="WN-XXXXXX"
                            value={inviteCode}
                            onChange={(e) => {
                              setInviteCode(e.target.value.toUpperCase());
                              setError(null);
                              setPreviewReady(false);
                            }}
                            className={cn(
                              "h-14 text-center text-2xl font-black tracking-widest bg-background/50 border-white/10 uppercase",
                              error && "border-red-500/50"
                            )}
                          />

                          {/* Live Preview */}
                          {inviteCode && !error && (
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <Sparkles className="h-3 w-3" />
                              Detecting workspace…
                            </div>
                          )}

                          {error && (
                            <div className="flex justify-center gap-2 text-xs text-red-500">
                              <AlertCircle className="h-3 w-3" />
                              {error}
                            </div>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading || inviteCode.length < 6}
                          className="w-full h-12 font-bold shadow-lg shadow-primary/30"
                        >
                          {isLoading ? "Validating..." : "Continue"}
                          {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </form>
                    </MotionDiv>
                  ) : (
                    <MotionDiv
                      key="email"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="text-center space-y-2">
                          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-bold">Workspace Found</h3>
                          <p className="text-sm text-muted-foreground">
                            Enter your email to join this team.
                          </p>
                        </div>

                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            required
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 pl-12 bg-background/50 border-white/10"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 font-bold shadow-lg shadow-primary/30"
                        >
                          {isLoading ? "Joining..." : "Join Workspace"}
                          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>

                        <button
                          type="button"
                          onClick={() => setStep("code")}
                          className="w-full text-xs text-muted-foreground hover:text-primary"
                        >
                          Use a different invite code
                        </button>
                      </form>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              Invite codes are unique and provided by workspace owners.
            </p>
          </MotionDiv>
        </PageTransition>
      </main>
    </div>
  );
}
