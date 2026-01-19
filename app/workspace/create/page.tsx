"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

export default function CreateWorkspacePage() {
  const router = useRouter();
  const { createWorkspace } = useWorkspaces(); // 🔹 auth intentionally ignored for now

  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const id = await createWorkspace(
        formData.name.trim(),
        formData.description.trim()
      );

      // ✅ Redirect to copy-code page (as decided)
      router.push(`/workspace/code/${id}`);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      <div className="absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[350px] w-[350px] rounded-full bg-accent/5 blur-[100px]" />

      {/* Centered, 1-screen layout */}
      <main className=" h-[calc(100vh-94px)] flex items-center justify-center px-4">
        <PageTransition>
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg space-y-6"
          >
            {/* Header */}
            <div className="space-y-2 text-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group justify-center"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Link>

              <h1 className="text-3xl font-black tracking-tight">
                Create Workspace
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Create a shared space for your team.
              </p>
            </div>

            {/* Card */}
            <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2rem]">
              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Workspace Name
                    </label>
                    <Input
                      required
                      placeholder="e.g. Acme Team"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-10 p-3 rounded-2xl bg-background/50 border-white/10 font-bold  text-transform: uppercase"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 ">
                      Description (Optional)
                    </label>
                    <Textarea
                      placeholder="Short description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="p-3 min-h-[80px] text-white rounded-2xl bg-background/50 border-white/10 resize-none text-sm  text-transform: capitalize"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating
                      </>
                    ) : (
                      <>
                        Create Workspace
                        <Plus className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Footer */}
                <div className="flex justify-center gap-6 pt-4 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" /> Secure
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> Instant
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </PageTransition>
      </main>
    </div>
  );
}
