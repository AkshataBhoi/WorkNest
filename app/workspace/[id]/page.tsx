"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, Shield, CheckCircle2, Clock, ArrowRight, Plus, Trash2, ListTodo, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Task } from "@/lib/data";
import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

export default function WorkspaceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getWorkspaceById, updateProjectStatus, updateWorkspaceStatus, assignTask, updateTaskStatus, currentUser, createProject } = useWorkspaces();
    const workspace = getWorkspaceById(params.id as string);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    if (!workspace) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Workspace not found</h1>
                <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            </div>
        );
    }

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName || workspace.role !== "Owner") return;
        createProject(workspace.id, newProjectName);
        setNewProjectName("");
        setIsCreatingProject(false);
    };

    const handleToggleProjectStatus = (projectId: string, currentStatus: "In Progress" | "Completed") => {
        if (workspace.role !== "Owner") return;
        const newStatus = currentStatus === "In Progress" ? "Completed" : "In Progress";
        updateProjectStatus(workspace.id, projectId, newStatus);
    };

    const handleWorkspaceStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (workspace.role !== "Owner") return;
        updateWorkspaceStatus(workspace.id, e.target.value as any);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle || !selectedMemberId || workspace.role !== "Owner") return;

        assignTask(workspace.id, {
            title: newTaskTitle,
            description: newTaskDesc,
            status: "Pending",
            memberId: selectedMemberId
        });

        setNewTaskTitle("");
        setNewTaskDesc("");
        setSelectedMemberId("");
    };

    const filteredTasks = workspace.role === "Owner"
        ? workspace.tasks
        : workspace.tasks.filter(t => t.memberId === currentUser.id);

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
                                    {workspace.role === "Owner" ? (
                                        <select
                                            value={workspace.status}
                                            onChange={handleWorkspaceStatusChange}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20",
                                                workspace.status === "Completed" ? "text-emerald-500 border-emerald-500/20" :
                                                    workspace.status === "In Progress" ? "text-amber-500 border-amber-500/20" :
                                                        workspace.status === "On Hold" ? "text-rose-500 border-rose-500/20" : "text-slate-500 border-slate-500/20"
                                            )}
                                        >
                                            <option value="In Progress" className="bg-background text-foreground">In Progress</option>
                                            <option value="Completed" className="bg-background text-foreground">Completed</option>
                                            <option value="On Hold" className="bg-background text-foreground">On Hold</option>
                                            <option value="Pending" className="bg-background text-foreground">Pending</option>
                                        </select>
                                    ) : (
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                            workspace.status === "Completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                workspace.status === "In Progress" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                    workspace.status === "On Hold" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                        )}>
                                            {workspace.status}
                                        </div>
                                    )}
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

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-12">
                        {/* MAIN CONTENT – TEAM RESPONSIBILITIES */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="glass-panel p-8 rounded-3xl space-y-8 shadow-sm h-full">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <ClipboardList className="h-5 w-5 text-primary" />
                                        Team Responsibilities
                                    </h2>
                                    {workspace.role === "Member" && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-xs font-medium text-primary uppercase tracking-widest font-black">
                                            <User className="h-3.5 w-3.5" />
                                            My Tasks
                                        </div>
                                    )}
                                </div>

                                {workspace.role === "Owner" && (
                                    <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block ml-1">Assign To</label>
                                            <select
                                                value={selectedMemberId}
                                                onChange={(e) => setSelectedMemberId(e.target.value)}
                                                required
                                                className="w-full h-10 px-3 rounded-xl bg-background border border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                            >
                                                <option value="">Select Member</option>
                                                {workspace.members.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block ml-1">Task Title</label>
                                            <Input
                                                placeholder="What needs to be done?"
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                                required
                                                className="h-10 rounded-xl bg-background border-white/10 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block ml-1">Description (Optional)</label>
                                            <Input
                                                placeholder="Add more details about this task..."
                                                value={newTaskDesc}
                                                onChange={(e) => setNewTaskDesc(e.target.value)}
                                                className="h-10 rounded-xl bg-background border-white/10 text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 font-black uppercase text-xs tracking-widest">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Assign Task
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-6">
                                    {workspace.members.map(member => {
                                        const memberTasks = filteredTasks.filter(t => t.memberId === member.id);
                                        if (workspace.role === "Member" && member.id !== currentUser.id) return null;

                                        if (memberTasks.length === 0 && workspace.role === "Member") {
                                            return (
                                                <div key={member.id} className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5 opacity-50">
                                                    <ListTodo className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-20" />
                                                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-black text-[10px]">No tasks assigned yet</p>
                                                </div>
                                            );
                                        }

                                        if (memberTasks.length === 0 && workspace.role === "Owner") return null;

                                        return (
                                            <div key={member.id} className="space-y-4">
                                                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {member.name[0]}
                                                    </div>
                                                    <span className="text-xs font-bold">{member.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest ml-auto font-black">{memberTasks.length} {memberTasks.length === 1 ? 'Task' : 'Tasks'}</span>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3">
                                                    {memberTasks.map(task => (
                                                        <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                                            <div className="flex flex-col min-w-0">
                                                                <h4 className="font-bold text-sm text-foreground">{task.title}</h4>
                                                                {task.description && (
                                                                    <p className="text-[10px] text-muted-foreground truncate font-medium opacity-80">{task.description}</p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <select
                                                                    value={task.status}
                                                                    onChange={(e) => updateTaskStatus(workspace.id, task.id, e.target.value as any)}
                                                                    className={cn(
                                                                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all",
                                                                        task.status === "Completed" ? "text-emerald-500 border-emerald-500/20" :
                                                                            task.status === "In Progress" ? "text-amber-500 border-amber-500/20" : "text-slate-500 border-slate-500/20"
                                                                    )}
                                                                >
                                                                    <option value="Pending" className="bg-[#1A1A1E] text-foreground">Pending</option>
                                                                    <option value="In Progress" className="bg-[#1A1A1E] text-foreground">In Progress</option>
                                                                    <option value="Completed" className="bg-[#1A1A1E] text-foreground">Completed</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {workspace.role === "Owner" && filteredTasks.length === 0 && (
                                        <div className="p-16 text-center rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02]">
                                            <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-10" />
                                            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.25em]">No active tasks</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SIDEBAR – MEMBERS & PROJECTS */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="glass-panel p-6 rounded-3xl space-y-6">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Team Members
                                </h2>

                                <div className="space-y-3">
                                    {workspace.members.map((member: any) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-3 rounded-2xl bg-background/40 border border-white/5 hover:border-primary/30 transition-all group"
                                        >
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center text-primary font-bold border border-primary/20 group-hover:scale-105 transition-transform shadow-inner text-xs">
                                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-xs truncate">{member.name}</span>
                                                <span className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-black">
                                                    {member.id === "user-1" ? "Owner" : "Member"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        Projects
                                    </h2>
                                    {workspace.role === "Owner" && !isCreatingProject && (
                                        <Button
                                            onClick={() => setIsCreatingProject(true)}
                                            size="sm"
                                            className="h-8 w-8 rounded-lg p-0"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {isCreatingProject && (
                                    <MotionDiv
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3"
                                    >
                                        <Input
                                            autoFocus
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            placeholder="Project name..."
                                            className="h-9 rounded-lg bg-background border-white/10 text-xs mb-3"
                                        />
                                        <div className="flex gap-4">
                                            <Button onClick={handleCreateProject} size="sm" className="flex-1 h-8 text-[10px]  font-black uppercase tracking-widest">Add</Button>
                                            <Button variant="ghost" onClick={() => setIsCreatingProject(false)} size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest">X</Button>
                                        </div>
                                    </MotionDiv>
                                )}

                                <div className="space-y-3">
                                    {(workspace.projects?.length || 0) > 0 ? (
                                        workspace.projects?.map((project: any) => (
                                            <div key={project.id} className="group p-4 rounded-2xl bg-background/40 border border-white/5 hover:border-primary/30 transition-all">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-bold text-xs group-hover:text-primary transition-colors truncate pr-2">{project.name}</h3>
                                                    <div
                                                        onClick={() => handleToggleProjectStatus(project.id, project.status)}
                                                        className={cn(
                                                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all shrink-0",
                                                            project.status === "Completed"
                                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                                : "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                                            workspace.role === "Owner" && "hover:bg-primary hover:text-white cursor-pointer"
                                                        )}
                                                    >
                                                        {project.status === "Completed" ? "Done" : "Active"}
                                                    </div>
                                                </div>
                                                <Link href={`/workspace/${workspace.id}/projects/${project.id}/expenses`}>
                                                    <Button variant="ghost" className="w-full h-8 px-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary rounded-lg transition-all group">
                                                        <span>Expenses</span>
                                                        <ArrowRight className="ml-auto h-3 w-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[10px] text-muted-foreground text-center py-4 uppercase tracking-[0.2em] font-black opacity-30 italic">No projects</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </PageTransition>
            </main>

            <Footer />
        </div >
    );
}
