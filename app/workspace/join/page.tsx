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
import { useAuth } from "@/components/context/AuthContext";
import { GmailAccountPicker } from "@/components/auth/GmailAccountPicker";
import { GmailAccount } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


const MotionDiv = motion.div as any;

export default function JoinWorkspacePage() {
  const { validateInviteCode, joinWorkspaceWithEmail } = useWorkspaces();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);
  const [showPicker, setShowPicker] = React.useState(false);
  const [targetWorkspaceId, setTargetWorkspaceId] = React.useState<string | null>(null);
  const [inviteCode, setInviteCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const router = useRouter();

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic format check
    const formattedCode = inviteCode.toUpperCase().trim();
    if (!formattedCode.startsWith("WN-")) {
      setError("Invalid invite code. Must start with WN-");
      setIsLoading(false);
      return;
    }

    try {
      const workspaceId = await validateInviteCode(formattedCode);
      if (workspaceId) {
        setTargetWorkspaceId(workspaceId);
        setShowPicker(true);
      } else {
        setError("Invalid invite code. Please check and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during validation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = async (account: GmailAccount) => {
    if (!targetWorkspaceId) return;

    setIsLoading(true);
    try {
      const success = await joinWorkspaceWithEmail(targetWorkspaceId, account.email, account.name);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Failed to join workspace.");
        setIsLoading(false); // Only reset if failed, otherwise we keep loading until redirect
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while joining.");
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <motion.div
        // animate={{ opacity: [0.4, 0.7, 0.4] }}
        // transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none"
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
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group justify-center"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Join Workspace
              </h1>
              <p className="text-muted-foreground">
                Securely connect with your team using an invite code.
              </p>

            </div>

            {/* Card */}
            <Card className="relative border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
              <CardContent className="relative p-8">
                <AnimatePresence mode="wait">
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
                          }}
                          className={cn(
                            "h-14 text-center text-2xl font-black tracking-widest bg-background/50 border-white/10 uppercase",
                            error && "border-red-500/50"
                          )}
                        />

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
                        {isLoading ? "Validating..." : "Join Workspace"}
                        {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </MotionDiv>
                </AnimatePresence>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              Invite codes are unique and provided by workspace owners.
            </p>
          </MotionDiv>
        </PageTransition>
      </main>

      {/* Gmail Account Picker Dialog */}
      <GmailAccountPicker
        open={showPicker}
        onOpenChange={setShowPicker}
        onSelectAccount={handleAccountSelect}
      />
    </div >
  );
}
