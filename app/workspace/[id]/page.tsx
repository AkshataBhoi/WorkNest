"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { useAuth } from "@/components/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  FolderPlus,
  ArrowRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { AddResponsibilityModal } from "@/components/workspace/AddResponsibilityModal";
import { AddProjectModal } from "@/components/workspace/AddProjectModal";
import { ResponsibilityCard } from "@/components/workspace/ResponsibilityCard";
import { isPast, parseISO } from "date-fns";

export default function WorkspaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const {
    getWorkspaceById,
    assignTask,
    updateTaskStatus,
    createProject,
    getUserRole,
    updateWorkspaceStatus, // 👈 ADD
  } = useWorkspaces();
  const workspace = getWorkspaceById(params.id as string);
  const userRole = workspace ? getUserRole(workspace.id) : null;

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Workspace not found</h1>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // --- Stats Calculation ---
  const totalTasks = workspace.tasks.length;
  const completedTasks = workspace.tasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const openTasks = totalTasks - completedTasks;
  const overdueTasks = workspace.tasks.filter((t) => {
    if (t.status === "Completed" || !t.dueDate) return false;
    return isPast(parseISO(t.dueDate));
  }).length;

  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // --- Handlers ---
  const handleAddTask = (taskData: {
    title: string;
    description: string;
    assignedTo: string[];
    dueDate: string;
    projectId?: string;
  }) => {
    assignTask(workspace.id, {
      ...taskData,
      status: "Pending",
    });
  };

  const handleCreateProject = (name: string) => {
    createProject(workspace.id, name);
  };
  const handleWorkspaceStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    updateWorkspaceStatus(
      workspace.id,
      e.target.value as "In Progress" | "Completed" | "On Hold" | "Pending"
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      <Navbar />

      {/* Background elements to match premium feel */}
      <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]" />
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <PageTransition>
          {/* Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 text-center md:text-left">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group px-4 py-2 rounded-xl  w-fit"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Workspace
              </Link>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-medium">{workspace.name}</h1>

                  {userRole === "Admin" ? (
                    <select
                      value={workspace.status || "In Progress"}
                      onChange={handleWorkspaceStatusChange}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border bg-transparent cursor-pointer",
                        workspace.status === "Completed"
                          ? "text-emerald-500 border-emerald-500/20"
                          : workspace.status === "In Progress"
                            ? "text-amber-500 border-amber-500/20"
                            : workspace.status === "On Hold"
                              ? "text-rose-500 border-rose-500/20"
                              : "text-slate-500 border-slate-500/20"
                      )}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Pending">Pending</option>
                    </select>
                  ) : (
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border",
                        workspace.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : workspace.status === "In Progress"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : workspace.status === "On Hold"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                      )}
                    >
                      {workspace.status}
                    </div>
                  )}
                </div>

                {/* <p className="text-sm font-bold tracking-tight lg:text-2xl text-foreground">
                  Responsibilities
                </p> */}
              </div>
            </div>

            {/* Primary CTA */}
            {userRole === "Admin" && (
              <Button
                onClick={() => setIsTaskModalOpen(true)}
                className="h-11 px-6 shadow-lg shadow-primary/20 group text-sm"
              >
                <Plus className="mr-3 h-5 w-5 stroke-[3px]" />
                Add Task
              </Button>
            )}
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {/* Open Tasks */}
            <div className="p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-white/10 flex items-center gap-5 shadow-inner">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-500/20">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground leading-none">
                  {openTasks}
                </p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-2">
                  Open Tasks
                </p>
              </div>
            </div>

            {/* Overdue */}
            <div className="p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-white/10 flex items-center gap-5 shadow-inner">
              <div className="h-14 w-14  sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-14 lg:w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 ring-1 ring-rose-500/20">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground leading-none">
                  {overdueTasks}
                </p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-2">
                  Overdue
                </p>
              </div>
            </div>

            {/* Success Rate – full width on mobile */}
            <div className="col-span-2 md:col-span-1 p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-white/10 flex items-center gap-5 shadow-inner">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10  flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground leading-none">
                  {completionPercentage}%
                </p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-2">
                  Success Rate
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Responsibilities List */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-8">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                Project Queue
              </h2>

              <div className="space-y-4">
                {workspace.tasks.length > 0 ? (
                  workspace.tasks.map((task) => (
                    <ResponsibilityCard
                      key={task.id}
                      task={task}
                      members={workspace.members}
                      projects={workspace.projects}
                      onStatusChange={(status) =>
                        updateTaskStatus(workspace.id, task.id, status)
                      }
                    />
                  ))
                ) : (
                  <div className="flex flex-col  items-center justify-center py-20 px-4 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.02] shadow-inner">
                    <div className="h-16 w-16 mb-6 rounded-[1.5rem] bg-white/5 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-3">
                      No tasks yet
                    </h3>
                    <p className="text-muted-foreground max-w-sm mb-8 text-sm font-medium opacity-60">
                      Start by adding responsibilities to your team. Everyone in
                      the workspace stays synced in real-time.
                    </p>
                    {userRole === "Admin" && (
                      <Button
                        onClick={() => setIsTaskModalOpen(true)}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-primary/20 hover:bg-primary/10 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest"
                      >
                        Add First Task
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Active Projects Panel - SCREENSHOT 2 DESIGN */}
              <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-base uppercase tracking-widest flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    Active Projects
                  </h3>
                  {userRole === "Admin" && (
                    <Button
                      size="sm"
                      onClick={() => setIsProjectModalOpen(true)}
                      className="h-10 w-10 p-0 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                      <Plus className="h-5 w-5 stroke-[3px]" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {workspace.projects && workspace.projects.length > 0 ? (
                    workspace.projects.map((project) => (
                      <div
                        key={project.id}
                        className="group p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-default"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-[15px] font-black text-transform: capitalize text-foreground group-hover:text-primary transition-colors">
                            {project.name}
                          </span>
                          <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                            ACTIVE
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            router.push(
                              `/workspace/${workspace.id}/projects/${project.id}/expenses`
                            )
                          }
                          className="w-full flex items-center justify-between text-left group/link"
                        >
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 group-hover/link:text-primary transition-colors">
                            Expenses
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover/link:text-primary group-hover/link:translate-x-1 transition-all" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center rounded-3xl bg-white/[0.01] border border-dashed border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">
                        No active projects
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Panel */}
              <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                <h3 className="font-black text-base uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-400" />
                  Team Nest
                </h3>
                <div className="space-y-6">
                  {workspace.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center text-xs font-black text-indigo-300 shadow-inner">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-black truncate">
                          {member.name}
                        </p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black opacity-60 mt-0.5">
                          {member.role || "Member"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {userRole === "Admin" && (
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4 opacity-50 text-center">
                      Collaboration Key
                    </p>
                    <div className="flex items-center gap-2 bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner">
                      <code className="flex-1 text-center font-mono text-xs font-black tracking-[0.3em] text-primary">
                        {workspace.inviteCode}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            workspace.inviteCode || ""
                          );
                          alert("Copy ID: Success!");
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageTransition>
      </main>

      {/* Modals */}
      <AddResponsibilityModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleAddTask}
        members={workspace.members}
        projects={workspace.projects || []}
      />

      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleCreateProject}
      />

      <Footer />
    </div>
  );
}
