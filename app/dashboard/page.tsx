"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import {
  Plus,
  Users,
  Search,
  MoreHorizontal,
  ArrowRight,
  Activity,
  LayoutDashboard,
  Eye,
  Loader2,
  Layers,
  CheckCircle,
  PauseCircle,
  Archive,
  Wallet,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { useRouter } from "next/navigation";
import { WorkspaceActions } from "@/components/workspace/WorkspaceActions";

export const STATUS_OPTIONS = [
  {
    key: "all",
    label: "All",
    icon: Layers,
  },
  {
    key: "In Progress",
    label: "In Progress",
    icon: Loader2,
    color: "text-amber-400",
  },
  {
    key: "Completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-emerald-400",
  },
  {
    key: "On Hold",
    label: "On Hold",
    icon: PauseCircle,
    color: "text-rose-400",
  },
  // {
  //   key: "Archived",
  //   label: "Archived",
  //   icon: Archive,
  //   color: "text-slate-400",
  // },
];

const MotionTr = motion.tr as any;
const MotionDiv = motion.div as any;

export default function DashboardPage() {
  const { workspaces, isInitialized } = useWorkspaces();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "mine" | "shared">(
    "all",
  );

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeStatus =
    STATUS_OPTIONS.find((s) => s.key === statusFilter) ?? STATUS_OPTIONS[0];

  const filteredWorkspaces = useMemo(() => {
    return workspaces
      .filter((ws) => {
        // 1. Role/Tab Filter
        if (activeFilter === "mine") return ws.ownerId === currentUser?.id;
        if (activeFilter === "shared") return ws.ownerId !== currentUser?.id;
        return true;
      })
      .filter((ws) => {
        // 2. Status Filter
        if (statusFilter === "all") return true;
        return ws.status === statusFilter;
      })
      .filter((ws) => {
        // 3. Search Search Query
        const query = searchQuery.toLowerCase();
        return (
          ws.name.toLowerCase().includes(query) ||
          ws.description.toLowerCase().includes(query)
        );
      });
  }, [workspaces, activeFilter, statusFilter, searchQuery, currentUser?.id]);

  function useIsMobile(breakpoint = 650) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
      const handler = () => setIsMobile(mq.matches);
      handler();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, [breakpoint]);

    return isMobile;
  }

  const getTotalExpense = (workspace: any) => {
    return (workspace.projects || []).reduce(
      (sum: number, project: any) => sum + (project.totalExpense || 0),
      0,
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

              <div className=" flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search + Filter Glass Group */}
                <div className="w-full lg:max-w-[750px]">
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

                    <div className="flex gap-4 items-center justify-between">
                      {/* Ownership Filter */}
                      <div className="relative shrink-0">
                        <select
                          value={activeFilter}
                          onChange={(e) =>
                            setActiveFilter(e.target.value as any)
                          }
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
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                      </div>

                      {/* Status Filter - Responsive UI Pattern with Icons */}
                      {!isMobile && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="inline-flex items-center justify-between gap-3 h-11 min-w-[120px] px-5 rounded-full bg-background/40 border border-white/5 text-[11px] font-black uppercase tracking-widest hover:text-primary transition-all group">
                              <div className="flex items-center gap-2">
                                <activeStatus.icon
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    activeStatus.color,
                                  )}
                                />
                                <span>{activeStatus.label}</span>
                              </div>
                              <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-52 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-1 shadow-2xl z-[100]"
                          >
                            {STATUS_OPTIONS.map(
                              ({ key, label, icon: Icon, color }) => {
                                const active = statusFilter === key;
                                return (
                                  <DropdownMenuItem
                                    key={key}
                                    onClick={() => setStatusFilter(key)}
                                    className={cn(
                                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all",
                                      active
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-white/5 text-muted-foreground hover:text-foreground",
                                    )}
                                  >
                                    <Icon className={cn("h-4 w-4", color)} />
                                    <span className="flex-1">{label}</span>
                                    {active && (
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                  </DropdownMenuItem>
                                );
                              },
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {isMobile && (
                        <>
                          <button
                            onClick={() => setMobileOpen(true)}
                            className="inline-flex items-center justify-between gap-3 h-11 min-w-[100px] px-5 rounded-full bg-background/40 border border-white/10 text-[11px] font-black uppercase tracking-widest">
                            <activeStatus.icon
                              className={cn("h-3.5 w-3.5", activeStatus.color)}
                            />
                            {activeStatus.label}
                            <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
                          </button>

                          {mobileOpen && (
                            typeof document !== "undefined" ? (
                              createPortal(
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                                  {/* MODAL */}
                                  <div
                                    className="w-full max-w-sm max-h-[70vh] rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                                      <h2 className="text-xs font-black uppercase tracking-widest">
                                        Status Filter
                                      </h2>
                                      <button
                                        onClick={() => setMobileOpen(false)}
                                        className="text-muted-foreground text-[10px] font-bold"
                                      >
                                        Close
                                      </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 space-y-2 overflow-y-auto">
                                      {STATUS_OPTIONS.map(
                                        ({ key, label, icon: Icon, color }) => {
                                          const active = statusFilter === key;
                                          return (
                                            <button
                                              key={key}
                                              onClick={() => {
                                                setStatusFilter(key);
                                                setMobileOpen(false);
                                              }}
                                              className={cn(
                                                "w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                                                active
                                                  ? "bg-primary/15 text-primary"
                                                  : "bg-white/5 text-muted-foreground hover:text-foreground",
                                              )}
                                            >
                                              <Icon
                                                className={cn("h-4 w-4", color)}
                                              />
                                              <span className="flex-1 text-left">
                                                {label}
                                              </span>
                                              {active && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                              )}
                                            </button>
                                          );
                                        },
                                      )}
                                    </div>
                                  </div>
                                </div>,
                                document.body
                              )
                            ) : null
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="relative z-10">
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

                    <Link
                      href="/workspace/join"
                      className="flex-1 sm:flex-none"
                    >
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
            </div>

            {/* Workspace Grid / Table Container */}
            <div className="space-y-8">
              <div className="hidden min-[750px]:block group relative rounded-3xl border border-white/10 bg-card/30 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
                <div className="w-full overflow-auto">
                  <table className="w-full table-fixed text-sm text-left border-collapse">
                    <colgroup>
                      <>
                        <col className="w-[200px]" />
                        <col className="hidden min-[1100px]:table-column w-[20%]" />
                        <col className="w-[120px]" />
                        <col className="hidden min-[900px]:table-column w-[120px]" />
                        <col className="hidden min-[1300px]:table-column w-[120px]" />
                        <col className="hidden min-[1200px]:table-column w-[150px]" />
                        <col className="w-[240px]" />
                      </>
                    </colgroup>
                    <thead>
                      <tr className="border-b border-white/5 h-14 text-sm text-muted-foreground">
                        <th className="px-6 text-left">Workspace</th>
                        <th className="px-6 text-left hidden min-[1100px]:table-cell">
                          Details
                        </th>
                        <th className="px-6 text-left">Status</th>
                        <th className="px-6 text-left hidden min-[900px]:table-cell">
                          Expense
                        </th>
                        <th className="px-6 text-left hidden min-[1300px]:table-cell">
                          Team
                        </th>
                        <th className="px-6 text-left hidden min-[1200px]:table-cell">
                          Joined At
                        </th>
                        <th className="px-6 text-right">Activity</th>
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
                                    ws.role === "Admin"
                                      ? "border-primary/20"
                                      : "border-white/10",
                                  )}
                                >
                                  {ws.role === "Admin" ? (
                                    <div className="h-5 w-5 text-primary">
                                      <LayoutDashboard className="h-6 w-6" />
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
                            <td className="px-6 py-5 hidden min-[1100px]:table-cell">
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed max-w-[200px]">
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
                                          : "bg-slate-400",
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
                                          : "text-slate-400",
                                  )}
                                >
                                  {ws.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 hidden min-[900px]:table-cell">
                              <Link
                                href={`/workspace/${ws.id}/expenses`}
                                className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium transition-all"
                              >
                                View
                              </Link>
                            </td>
                            <td className="px-6 py-5 hidden min-[1300px]:table-cell">
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
                            <td className="px-6 py-5 whitespace-nowrap hidden min-[1200px]:table-cell">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">
                                  {(() => {
                                    const currentEmail =
                                      typeof window !== "undefined"
                                        ? localStorage.getItem(
                                          "worknest_current_email",
                                        )
                                        : null;

                                    const member = ws.members.find(
                                      (m) =>
                                        m.email === currentEmail ||
                                        m.id === currentUser?.id,
                                    );

                                    const rawDate =
                                      member?.joinedAt ||
                                      ws.createdAt ||
                                      ws.lastActive;

                                    if (!rawDate) return "N/A";

                                    let date: Date;

                                    // Firestore Timestamp support
                                    if (
                                      typeof rawDate === "object" &&
                                      "toDate" in rawDate
                                    ) {
                                      date = rawDate.toDate();
                                    } else {
                                      date = new Date(rawDate);
                                    }

                                    if (isNaN(date.getTime())) return "N/A";

                                    return date.toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    });
                                  })()}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase opacity-50 tracking-wider">
                                  Last edit
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-3">
                                <Link
                                  href={`/workspace/${ws.id}`}
                                  className="inline-flex items-center justify-center h-10 px-5 rounded-xl border border-white/10 bg-white/5 hover:bg-primary hover:border-primary/50 hover:text-primary-foreground transition-all duration-300 text-sm font-bold"
                                >
                                  Open Workspace
                                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                </Link>
                                <WorkspaceActions workspace={ws} />
                              </div>
                            </td>
                            {/* <td className="px-6 py-5 text-right">
                              <WorkspaceActions workspace={ws} />
                            </td> */}
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
              <div className="min-[750px]:hidden space-y-4">
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
                              ws.role === "Admin"
                                ? "border-primary/20"
                                : "border-white/10",
                            )}
                          >
                            {ws.role === "Admin" ? (
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
                                    : "bg-slate-400",
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
                                    : "text-slate-400",
                            )}
                          >
                            {ws.status}
                          </span>
                        </div>
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
                        {/* <Link
                          href={`/workspace/${ws.id}/expenses`}
                          className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/5 bg-white/5 hover:bg-emerald-500 hover:text-white hover:border-emerald-500/50 transition-all duration-300"
                          title="View Expenses"
                        >
                          <Wallet className="h-4 w-4" />
                        </Link> */}
                        <Link
                          href={`/workspace/${ws.id}`}
                          className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/5 bg-white/5 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 transition-all duration-300"
                          title="Open Workspace"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <WorkspaceActions workspace={ws} />
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
