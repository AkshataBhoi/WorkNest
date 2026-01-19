"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    CheckCircle2,
    Copy,
    LayoutDashboard,
    Sparkles,
    Shield,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

export default function WorkspaceCodePage() {
    const params = useParams();
    const router = useRouter();
    const { getWorkspaceById, isInitialized } = useWorkspaces();
    const [copied, setCopied] = React.useState(false);

    const workspace = getWorkspaceById(params.id as string);

    if (isInitialized && !workspace) {
        router.push("/dashboard");
        return null;
    }

    const copyToClipboard = () => {
        if (workspace?.inviteCode) {
            navigator.clipboard.writeText(workspace.inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isInitialized) return null;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <Navbar />

            {/* Brand Background Elements */}
            <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

            <main className="container mx-auto max-w-xl px-4 py-16 sm:py-24 relative z-10">
                <PageTransition>
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden text-center py-12">
                            <CardHeader className="pt-0">
                                <div className="mx-auto h-20 w-20 rounded-[2.5rem] border-4 border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                </div>
                                <CardTitle className="text-3xl font-black tracking-tight">Workspace Ready!</CardTitle>
                                <CardDescription className="text-base pt-2">
                                    Your workspace <span className="text-foreground font-bold italic">"{workspace?.name}"</span> is fully configured.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Share Invite Code</p>
                                    <div className="flex items-center gap-2 bg-background/60 p-2 pl-6 rounded-3xl border border-white/5 group transition-all hover:border-primary/30">
                                        <span className="flex-1 font-mono text-2xl font-black tracking-widest text-primary truncate uppercase">
                                            {workspace?.inviteCode}
                                        </span>
                                        <Button
                                            variant="secondary"
                                            onClick={copyToClipboard}
                                            className="h-14 w-14 rounded-2.5xl group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0"
                                        >
                                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <Link href="/dashboard" className="block">
                                        <Button className="w-full h-14 text-md font-black rounded-3xl shadow-xl shadow-primary/20 uppercase tracking-widest">
                                            Go to Dashboard
                                            <LayoutDashboard className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <p className="text-[10px] text-muted-foreground px-8 leading-relaxed font-bold uppercase tracking-wider opacity-60">
                                        Team members with this code can join and start collaborating immediately.
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 pt-8 border-t border-white/5 opacity-50 justify-center text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-3.5 w-3.5" /> SECURE
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-3.5 w-3.5" /> INSTANT
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
