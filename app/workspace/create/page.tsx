"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Rocket,
    CheckCircle2,
    Copy,
    Layout,
    Plus,
    Sparkles,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionDiv = motion.div as any;

export default function CreateWorkspacePage() {
    const router = useRouter();
    const { createWorkspace, workspaces } = useWorkspaces();
    const [isLoading, setIsLoading] = React.useState(false);
    const [step, setStep] = React.useState<"form" | "success">("form");
    const [formData, setFormData] = React.useState({ name: "", description: "" });
    const [createdId, setCreatedId] = React.useState("");

    const workspace = workspaces.find(ws => ws.id === createdId);
    const inviteCode = workspace?.inviteCode || "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a brief loading state for a polished feel
        await new Promise(r => setTimeout(r, 1000));

        const id = createWorkspace(formData.name, formData.description);
        setCreatedId(id);
        setStep("success");
        setIsLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteCode);
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <Navbar />

            {/* Brand Background Elements (Matching Landing Page) */}
            <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

            <main className="container mx-auto max-w-xl px-4 py-16 sm:py-24 relative z-10">
                <PageTransition>
                    <AnimatePresence mode="wait">
                        {step === "form" ? (
                            <MotionDiv
                                key="form-step"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group mb-4"
                                    >
                                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                        Back to Dashboard
                                    </Link>
                                    <h1 className="text-4xl font-extrabold tracking-tight">Create Workspace</h1>
                                    <p className="text-muted-foreground">Setup a new collaborative environment for your team.</p>
                                </div>

                                <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl">
                                    <CardContent className="pt-8 space-y-6">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1">Workspace Name</label>
                                                <Input
                                                    required
                                                    placeholder="e.g. Acme Marketing"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="h-12 bg-background/50 border-white/10 focus:ring-primary/20 transition-all shadow-inner"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1">Description (Optional)</label>
                                                <Textarea
                                                    placeholder="What's this workspace for?"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="min-h-[100px] bg-background/50 border-white/10 focus:ring-primary/20 transition-all shadow-inner resize-none py-3"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-12 text-md font-bold shadow-lg shadow-primary/20"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Creating..." : "Create Workspace"}
                                                {!isLoading && <Plus className="ml-2 h-4 w-4" />}
                                            </Button>
                                        </form>

                                        <div className="flex items-center gap-4 pt-4 border-t border-white/5 opacity-50 justify-center text-xs">
                                            <div className="flex items-center gap-1">
                                                <Shield className="h-3 w-3" /> Encrypted
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Sparkles className="h-3 w-3" /> Instant Setup
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </MotionDiv>
                        ) : (
                            <MotionDiv
                                key="success-step"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden text-center py-12">
                                    <CardHeader className="pt-0">
                                        <div className="mx-auto h-20 w-20 rounded-full border-4 border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center mb-4">
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                        </div>
                                        <CardTitle className="text-3xl font-extrabold tracking-tight">Workspace Ready!</CardTitle>
                                        <CardDescription className="text-base pt-2">
                                            Your workspace <span className="text-foreground font-bold italic">"{formData.name}"</span> has been configured.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-8">
                                        <div className="space-y-3">
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Share Invite Code</p>
                                            <div className="flex items-center gap-2 bg-background/60 p-2 pl-6 rounded-2xl border border-white/5 group transition-all hover:border-primary/30">
                                                <span className="flex-1 font-mono text-xl font-bold tracking-widest text-primary truncate uppercase">
                                                    {inviteCode}
                                                </span>
                                                <Button
                                                    variant="secondary"
                                                    onClick={copyToClipboard}
                                                    className="h-12 w-12 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                                >
                                                    <Copy className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <Link href="/dashboard" className="block">
                                                <Button className="w-full h-12 text-md font-bold">
                                                    Got to Dashboard
                                                </Button>
                                            </Link>
                                            <p className="text-[10px] text-muted-foreground px-8 leading-relaxed">
                                                Any team member with this code can join and start collaborating immediately. You can also find this code in Workspace Settings later.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </PageTransition>
            </main>
        </div>
    );
}
