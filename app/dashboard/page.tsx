"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users, Search, MoreHorizontal, ArrowRight, Calendar, Activity, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/components/context/WorkspaceContext";

// Type-safe workarounds for Framer Motion + React 19
const MotionTr = motion.tr as any;
const MotionDiv = motion.div as any;

export default function DashboardPage() {
    const { workspaces } = useWorkspaces();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredWorkspaces = workspaces.filter((ws) =>
        ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <Navbar />

            {/* Premium Background Elements */}
            <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]" />
            <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

            <main className="container mx-auto p-4 sm:p-8 lg:p-12">
                <PageTransition>
                    <div className="p-2 -mt-5 flex flex-col gap-10">
                        {/* Header Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
                            {/* Left: Title & Subtitle */}
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary w-fit">
                                    <Activity className="h-3 w-3" />
                                    Active Dashboard
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Your Workspaces</h1>
                                <p className="text-muted-foreground text-sm max-w-sm line-clamp-1">
                                    Manage your collaborative environments efficiently.
                                </p>
                            </div>

                            {/* Center: Search Bar */}
                            <div className="flex justify-center">
                                <div className="relative w-full max-w-md bg-card/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                    <input
                                        placeholder="Search workspaces..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-20 h-11 flex items-center bg-background/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-background/30 rounded-lg px-2 py-1 border border-white/5">
                                        {filteredWorkspaces.length}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Action Buttons */}
                            <div className="flex justify-end gap-3 shrink-0">
                                <Link href="/workspace/create">
                                    <Button className="h-11 px-6 shadow-lg shadow-primary/20 group text-sm">
                                        <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                                        New Workspace
                                    </Button>
                                </Link>
                                <Link href="/workspace/join">
                                    <Button variant="outline" className="h-11 px-6 backdrop-blur-sm bg-background/50 border-white/10 hover:bg-background/80 text-sm">
                                        <Users className="mr-2 h-4 w-4" />
                                        Join
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Content Table Container */}
                        <div className="space-y-6">
                            {/* Toolbar */}
                            {/* <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                <div className="relative w-full sm:max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                    <input
                                        placeholder="Search workspaces..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 h-10 flex items-center bg-background/50 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/30 rounded-lg px-3 py-2 border border-white/5">
                                    <span className="font-medium text-foreground">{filteredWorkspaces.length}</span> Result{filteredWorkspaces.length !== 1 ? 's' : ''}
                                </div>
                            </div> */}

                            {/* Enhanced Table */}
                            <div className="group relative rounded-3xl border border-white/10 bg-card/30 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
                                <div className="w-full overflow-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 h-14">
                                                <th className="px-6 font-semibold text-muted-foreground tracking-tight">Workspace</th>
                                                <th className="px-6 font-semibold text-muted-foreground tracking-tight hidden md:table-cell">Details</th>
                                                <th className="px-6 font-semibold text-muted-foreground tracking-tight">Status</th>
                                                <th className="px-6 font-semibold text-muted-foreground tracking-tight">Total Expense</th>
                                                <th className="px-6 font-semibold text-muted-foreground tracking-tight lg:table-cell hidden">Team</th>
                                                <th className="px-6 font-semibold text-muted-foreground tracking-tight text-right">Activity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            <AnimatePresence mode="popLayout">
                                                {filteredWorkspaces.map((ws, index) => (
                                                    <MotionTr
                                                        key={ws.id}
                                                        layout={true}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="group/row relative border-0 cursor-default transition-all duration-200 hover:bg-white/[0.03]"
                                                    >
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn(
                                                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br from-background/50 to-card transition-transform group-hover/row:scale-105 shadow-inner",
                                                                    ws.role === "Owner" ? "border-primary/20" : "border-white/10"
                                                                )}>
                                                                    {ws.role === "Owner" ? (
                                                                        <div className="h-5 w-5 text-primary">
                                                                            <LayoutDashboard className="h-4 w-4" />
                                                                        </div>
                                                                    ) : (
                                                                        <Users className="h-5 w-5 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="font-bold text-base text-foreground group-hover/row:text-primary transition-colors truncate">
                                                                        {ws.name}
                                                                    </span>
                                                                    <span className="text-xs font-medium text-primary mt-0.5 tracking-wide uppercase opacity-70">
                                                                        {ws.role}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 hidden md:table-cell max-w-xs">
                                                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                                                {ws.description}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "h-2 w-2 rounded-full inline-block",
                                                                    ws.status === "In Progress" ? "bg-amber-400" :
                                                                        ws.status === "Completed" ? "bg-emerald-400" :
                                                                            ws.status === "On Hold" ? "bg-rose-400" : "bg-slate-400"
                                                                )} />
                                                                <span className={cn(
                                                                    "font-medium text-sm",
                                                                    ws.status === "In Progress" ? "text-amber-400" :
                                                                        ws.status === "Completed" ? "text-emerald-400" :
                                                                            ws.status === "On Hold" ? "text-rose-400" : "text-slate-400"
                                                                )}>
                                                                    {ws.status}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <Link
                                                                href={`/workspace/${ws.id}/expenses`}
                                                                className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium transition-all"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-5 lg:table-cell hidden">
                                                            <div className="flex -space-x-2.5 overflow-hidden">
                                                                {ws.members.slice(0, 3).map((member, i) => (
                                                                    <div
                                                                        key={member.id}
                                                                        title={member.email}
                                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent/20 text-[10px] font-bold text-primary ring-2 ring-transparent transition-transform hover:-translate-y-1 hover:z-10 cursor-help"
                                                                    >
                                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                ))}
                                                                {ws.members.length > 3 && (
                                                                    <div
                                                                        title={ws.members.slice(3).map(m => m.email).join(', ')}
                                                                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground cursor-help"
                                                                    >
                                                                        +{ws.members.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <div className="flex flex-col items-end mr-4 hidden sm:flex">
                                                                    <span className="text-foreground font-medium flex items-center gap-1.5">
                                                                        <Calendar className="h-3 w-3 opacity-50" />
                                                                        {ws.lastActive}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Last Edit</span>
                                                                </div>
                                                                <Link
                                                                    href={`/workspace/${ws.id}`}
                                                                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm font-medium"
                                                                >
                                                                    Open Workspace
                                                                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </MotionTr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                {filteredWorkspaces.length === 0 && (
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-20"
                                    >
                                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-white/5 mb-4">
                                            <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-1">No workspaces found</h3>
                                        <p className="text-muted-foreground">Try adjusting your search query</p>
                                    </MotionDiv>
                                )}
                            </div>
                        </div>
                    </div>
                </PageTransition>
            </main>

        </div>
    );
}
