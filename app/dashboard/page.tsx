"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
// import { Plus, Users, Search, Activity, LayoutDashboard, ArrowRight } from "lucide-react";
import {
  Plus,
  Users,
  Search,
  MoreHorizontal,
  ArrowRight,
  Calendar,
  Activity,
  LayoutDashboard,
  Eye,
  Settings,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { useRouter } from "next/navigation";

const MotionTr = motion.tr as any;
const MotionDiv = motion.div as any;

export default function DashboardPage() {
  const { workspaces, isInitialized } = useWorkspaces();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "mine" | "shared">(
    "all"
  );

  const filteredWorkspaces = useMemo(() => {
    return workspaces
      .filter((ws) => {
        // Filter by role/tab
        if (activeFilter === "mine") return ws.ownerId === currentUser?.id;
        if (activeFilter === "shared") return ws.ownerId !== currentUser?.id;
        return true;
      })
      .filter((ws) => {
        // Filter by search query
        const query = searchQuery.toLowerCase();
        return (
          ws.name.toLowerCase().includes(query) ||
          ws.description.toLowerCase().includes(query)
        );
      });
  }, [workspaces, activeFilter, searchQuery, currentUser?.id]);

  const getTotalExpense = (workspace: any) => {
    return (workspace.projects || []).reduce(
      (sum: number, project: any) => sum + (project.totalExpense || 0),
      0
    );
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Loading Workspaces
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />

      {/* Premium Radial Gradients for Depth */}
      <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]" />
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

      <main className="container mx-auto p-4 sm:p-8 lg:p-12">
        <PageTransition>
          <div className="p-2 -mt-5 flex flex-col gap-10">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex flex-col gap-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 w-fit mx-auto lg:mx-0">
                  <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                    Active Dashboard
                  </span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-black tracking-[-0.04em]">
                    Your Workspaces
                  </h1>
                  <p className="text-[#94949E] text-lg font-medium max-w-lg opacity-80 leading-relaxed">
                    Manage your collaborative environments efficiently.
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search + Filter Glass Group */}
                <div className="w-full lg:max-w-[620px]">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-card/30 backdrop-blur-xl rounded-[2rem] border border-white/5">
                    {/* Search */}
                    <div className="relative flex-1 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        placeholder="Search workspaces..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 rounded-[2rem] bg-background/40 border border-white/5 text-[12px] font-medium focus:outline-none focus:bg-background/60 transition-all placeholder:text-muted-foreground/40"
                      />
                    </div>

                    {/* Filter */}
                    <div className="relative shrink-0">
                      <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value as any)}
                        className="appearance-none h-11 pl-5 pr-10 rounded-[2rem] bg-background/40 border border-white/5 text-[11px] font-black uppercase tracking-widest cursor-pointer focus:outline-none hover:text-primary transition-colors"
                      >
                        <option value="all" className="bg-slate-900">
                          All
                        </option>
                        <option value="mine" className="bg-slate-900">
                          Mine
                        </option>
                        <option value="shared" className="bg-slate-900">
                          Shared
                        </option>
                      </select>

                      <MoreHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    href="/workspace/create"
                    className="flex-1 sm:flex-none"
                  >
                    <Button className="w-full h-14 px-8 rounded-[1.2rem] shadow-2xl shadow-primary/20 bg-primary hover:scale-[1.03] transition-all active:scale-[0.97] font-black uppercase tracking-widest text-[12px]">
                      <Plus className="mr-2 h-4 w-4" />
                      Create
                    </Button>
                  </Link>

                  <Link href="/workspace/join" className="flex-1 sm:flex-none">
                    <Button
                      variant="outline"
                      className="w-full h-14 px-8 rounded-[1.2rem] border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[12px]"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Join
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Workspace Grid / Table Container */}
            <div className="space-y-8">
              <div className="hidden md:block group relative rounded-3xl border border-white/10 bg-card/30 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
                <div className="w-full overflow-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 h-14">
                        <th className="px-6 font-semibold text-muted-foreground tracking-tight">
                          Workspace
                        </th>
                        <th className="px-6 font-semibold text-muted-foreground tracking-tight hidden md:table-cell">
                          Details
                        </th>
                        <th className="px-6 font-semibold text-muted-foreground tracking-tight">
                          Status
                        </th>
                        <th className="px-6 font-semibold text-muted-foreground tracking-tight">
                          Total Expense
                        </th>
                        <th className="px-6 font-semibold text-muted-foreground tracking-tight lg:table-cell hidden">
                          Team
                        </th>
                        <th className="px-6 font-semibold text-muted-foreground tracking-tight">
                          Joined At
                        </th>
                        <th className="px-6 font-semibold text-muted-foreground tracking-tight text-right">
                          Activity
                        </th>
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
                                <div
                                  className={cn(
                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br from-background/50 to-card transition-transform group-hover/row:scale-105 shadow-inner",
                                    ws.role === "admin"
                                      ? "border-primary/20"
                                      : "border-white/10"
                                  )}
                                >
                                  {ws.role === "admin" ? (
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
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full inline-block",
                                    ws.status === "In Progress"
                                      ? "bg-amber-400"
                                      : ws.status === "Completed"
                                      ? "bg-emerald-400"
                                      : ws.status === "On Hold"
                                      ? "bg-rose-400"
                                      : "bg-slate-400"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "font-medium text-sm",
                                    ws.status === "In Progress"
                                      ? "text-amber-400"
                                      : ws.status === "Completed"
                                      ? "text-emerald-400"
                                      : ws.status === "On Hold"
                                      ? "text-rose-400"
                                      : "text-slate-400"
                                  )}
                                >
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
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                ))}
                                {ws.members.length > 3 && (
                                  <div
                                    title={ws.members
                                      .slice(3)
                                      .map((m) => m.email)
                                      .join(", ")}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground cursor-help"
                                  >
                                    +{ws.members.length - 3}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className=" text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-3">
                                <div className="flex flex-col items-end mr-4 hidden sm:flex">
                                  {(() => {
                                    const currentEmail =
                                      typeof window !== "undefined"
                                        ? localStorage.getItem(
                                            "worknest_current_email"
                                          )
                                        : null;
                                    const member = ws.members.find(
                                      (m) =>
                                        m.email === currentEmail ||
                                        m.id === currentUser?.id
                                    );
                                    const joinDate =
                                      member?.joinedAt ||
                                      ws.createdAt ||
                                      ws.lastActive;

                                    try {
                                      return new Date(
                                        joinDate
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      });
                                    } catch (e) {
                                      return "N/A";
                                    }
                                  })()}
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                    Last Edit
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-3">
                                <div className="flex flex-col items-end mr-4 hidden sm:flex">
                                  {/* <span className="text-foreground font-medium flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3 opacity-50" />
                                    {ws.lastActive}
                                  </span> */}

                                  {/* <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                    Last Edit
                                  </span> */}
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
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      No workspaces found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search query
                    </p>
                  </MotionDiv>
                )}
              </div>
              <div className="md:hidden space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredWorkspaces.map((ws, index) => (
                    <MotionDiv
                      key={ws.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative rounded-2xl border border-white/10 bg-card/30 backdrop-blur-xl p-5 transition-all duration-300 hover:border-white/20"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br from-background/50 to-card shadow-inner",
                              ws.role === "admin"
                                ? "border-primary/20"
                                : "border-white/10"
                            )}
                          >
                            {ws.role === "admin" ? (
                              <LayoutDashboard className="h-5 w-5 text-primary" />
                            ) : (
                              <Users className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-bold text-base text-foreground truncate">
                              {ws.name}
                            </span>
                            <span className="text-xs font-medium text-primary mt-0.5 tracking-wide uppercase opacity-70">
                              {ws.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full inline-block",
                              ws.status === "In Progress"
                                ? "bg-amber-400"
                                : ws.status === "Completed"
                                ? "bg-emerald-400"
                                : ws.status === "On Hold"
                                ? "bg-rose-400"
                                : "bg-slate-400"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium text-sm",
                              ws.status === "In Progress"
                                ? "text-amber-400"
                                : ws.status === "Completed"
                                ? "text-emerald-400"
                                : ws.status === "On Hold"
                                ? "text-rose-400"
                                : "text-slate-400"
                            )}
                          >
                            {ws.status}
                          </span>
                        </div>
                        {/* <div className="text-right">
                          <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                            Joined At
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {(() => {
                              const currentEmail = typeof window !== "undefined" ? localStorage.getItem("worknest_current_email") : null;
                              const member = ws.members.find(m => m.email === currentEmail || m.id === currentUser?.id);
                              const joinDate = member?.joinedAt || ws.createdAt || ws.lastActive;

                              try {
                                return new Date(joinDate).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                });
                              } catch (e) {
                                return "N/A";
                              }
                            })()}
                          </span>
                        </div> */}
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                            Expense
                          </span>
                          <span className="text-base font-bold text-foreground">
                            ${getTotalExpense(ws).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                        <Link
                          href={`/workspace/${ws.id}`}
                          className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/5 bg-white/5 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 transition-all duration-300"
                          title="Open Workspace"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {/* <Link
                                                    href={`/workspace/${ws.id}`}
                                                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                                    title="Manage Workspace"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Link> */}
                      </div>
                    </MotionDiv>
                  ))}
                </AnimatePresence>

                {filteredWorkspaces.length === 0 && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 rounded-2xl border border-white/10 bg-card/30 backdrop-blur-xl"
                  >
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-white/5 mb-4">
                      <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      No workspaces found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search query
                    </p>
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
