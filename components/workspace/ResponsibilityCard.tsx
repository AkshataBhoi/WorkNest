"use client";

import { Task, Member, Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, MoreHorizontal, Calendar, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isPast, parseISO } from "date-fns";

interface ResponsibilityCardProps {
    task: Task;
    members: Member[];
    projects: Project[];
    onStatusChange: (status: Task["status"]) => void;
}

export function ResponsibilityCard({ task, members, projects, onStatusChange }: ResponsibilityCardProps) {
    const assignedMembers = members.filter(m => task.assignedTo.includes(m.id));
    const project = projects.find(p => p.id === task.projectId);

    const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
    const isOverdue = dueDate ? isPast(dueDate) && task.status !== "Completed" : false;

    // Status Styling Logic
    const getStatusConfig = (status: Task["status"]) => {
        switch (status) {
            case "Completed": return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 };
            case "In Progress": return { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock };
            default: return { color: "text-slate-500", bg: "bg-white/5", border: "border-white/5", icon: Circle };
        }
    };

    const config = getStatusConfig(task.status);
    const StatusIcon = config.icon;

    return (
        <div className={cn(
            "group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[2rem] bg-[#131316] border border-white/5 hover:border-white/10 transition-all gap-6 shadow-xl bg-card/30 backdrop-blur-xl",
            task.status === "Completed" && "opacity-70 grayscale-[0.3]"
        )}>
            <div className="flex items-start gap-5 flex-1">
                {/* Status Toggle Button */}
                <button
                    onClick={() => onStatusChange(task.status === "Completed" ? "Pending" : "Completed")}
                    className={cn(
                        "mt-1.5 transition-all hover:scale-110",
                        task.status === "Completed" ? "text-emerald-500" : "text-muted-foreground/40 hover:text-primary"
                    )}
                >
                    <StatusIcon className="h-8 w-8 stroke-[1.5px]" />
                </button>

                <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={cn(
                            "font-black text-lg tracking-tight",
                            task.status === "Completed" && "line-through opacity-40"
                        )}>
                            {task.title}
                        </span>
                        {project && (
                            <span className="px-3 py-1 rounded-xl bg-primary/5 border border-primary/10 text-[9px] font-black uppercase tracking-widest text-primary/80">
                                {project.name}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/60">
                        {/* Due Date Indicator */}
                        {dueDate && (
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1 rounded-xl border transition-colors",
                                isOverdue
                                    ? "text-rose-400 border-rose-400/20 bg-rose-400/5 shadow-inner"
                                    : "border-white/5 bg-white/5 opacity-80"
                            )}>
                                {isOverdue && <AlertCircle className="h-3.5 w-3.5" />}
                                <span>{format(dueDate, "MMMM d")}</span>
                            </div>
                        )}

                        {/* Assignees Overlap */}
                        {assignedMembers.length > 0 && (
                            <div className="flex items-center -space-x-3">
                                {assignedMembers.map(m => (
                                    <div
                                        key={m.id}
                                        className="h-8 w-8 rounded-full border-2 border-[#131316] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-[10px] font-black text-indigo-300 ring-4 ring-black/5"
                                        title={m.name}
                                    >
                                        {m.name.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {task.description && (
                            <p className="hidden md:block max-w-[200px] truncate opacity-50 italic font-medium">
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Dropdown Picker - AS REQUESTED */}
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pl-12 md:pl-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "h-11 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg",
                                config.color,
                                config.bg,
                                config.border,
                                "hover:scale-[1.02] active:scale-[0.98]"
                            )}
                        >
                            <span className={cn("h-2 w-2 rounded-full", task.status === "Completed" ? "bg-emerald-500" : task.status === "In Progress" ? "bg-amber-500" : "bg-slate-400")} />
                            {task.status}
                            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 bg-[#0F0F12] border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                        <DropdownMenuItem
                            onClick={() => onStatusChange("Pending")}
                            className="rounded-xl flex items-center gap-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:bg-white/5 focus:text-foreground cursor-pointer"
                        >
                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                            Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onStatusChange("In Progress")}
                            className="rounded-xl flex items-center gap-3 py-3 text-[10px] font-black uppercase tracking-widest text-amber-500 focus:bg-amber-500/10 focus:text-amber-500 cursor-pointer"
                        >
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onStatusChange("Completed")}
                            className="rounded-xl flex items-center gap-3 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer"
                        >
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            Completed
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl opacity-20 hover:opacity-100 hover:bg-white/5 transition-all">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
