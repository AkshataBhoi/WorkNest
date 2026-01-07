"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, Shield, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function WorkspaceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getWorkspaceById, updateProjectStatus } = useWorkspaces();
    const workspace = getWorkspaceById(params.id as string);

    if (!workspace) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Workspace not found</h1>
                <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            </div>
        );
    }

    const handleToggleProjectStatus = (projectId: string, currentStatus: "In Progress" | "Completed") => {
        if (workspace.role !== "Owner") return;
        const newStatus = currentStatus === "In Progress" ? "Completed" : "In Progress";
        updateProjectStatus(workspace.id, projectId, newStatus);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <PageTransition>
                    <div className="mb-8">
                        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Dashboard
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{workspace.name}</h1>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                        workspace.status === "Completed"
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        {workspace.status}
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-lg max-w-2xl">
                                    {workspace.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-card/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="flex flex-col items-center px-4 border-r border-white/10">
                                    <span className="text-2xl font-bold text-primary">{workspace.members.length}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Members</span>
                                </div>
                                <div className="flex flex-col items-center px-4 border-r border-white/10">
                                    <Shield className="h-5 w-5 text-indigo-400 mb-1" />
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Secure</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    {workspace.status === "Completed" ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-1" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-amber-400 mb-1" />
                                    )}
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Status</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 mt-12">
                        {/* Projects Section */}
                        <div className="glass-panel p-8 rounded-3xl space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Active Projects
                                </h2>
                                {workspace.role === "Owner" && (
                                    <Button size="sm" className="rounded-xl shadow-lg shadow-primary/20">
                                        New Project
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(workspace.projects?.length || 0) > 0 ? (
                                    workspace.projects?.map((project: any) => (
                                        <div key={project.id} className="group relative overflow-hidden p-6 rounded-2xl bg-background/40 border border-white/5 hover:border-primary/30 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                                                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold font-mono">
                                                        Total: ₹{(project.totalExpense || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div
                                                    onClick={() => handleToggleProjectStatus(project.id, project.status)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors select-none",
                                                        project.status === "Completed"
                                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                            : "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                                        workspace.role === "Owner" && "hover:bg-primary hover:text-white cursor-pointer"
                                                    )}
                                                >
                                                    {project.status}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-6">
                                                <div className="flex -space-x-2">
                                                    {workspace.members.slice(0, 3).map((m: any, i: number) => (
                                                        <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                                            {m.name[0]}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Link href={`/workspace/${workspace.id}/projects/${project.id}/expenses`}>
                                                    <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10 hover:text-primary rounded-lg transition-all">
                                                        Manage Expenses
                                                        <ArrowRight className="ml-1.5 h-3 w-3" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-background/20 rounded-2xl border border-dashed border-white/10">
                                        <p className="text-muted-foreground">No projects found in this workspace.</p>
                                        {workspace.role === "Owner" && (
                                            <Button variant="ghost" className="text-primary mt-2">Create your first project</Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Team Members Section */}
                        <div className="glass-panel p-8 rounded-3xl space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Team Members
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {workspace.members.map((member: any) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-background/40 border border-white/5 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center text-primary font-bold border border-primary/20 group-hover:scale-105 transition-transform shadow-inner">
                                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-sm truncate">{member.name}</span>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                                                <Mail className="h-3 w-3 opacity-50" />
                                                {member.email}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </PageTransition>
            </main>

            <Footer />
        </div>
    );
}
