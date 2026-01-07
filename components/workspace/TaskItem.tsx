"use client";

import { CheckCircle2, Circle, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


interface TaskItemProps {
    id: string;
    title: string;
    assignee: string;
    status: "To Do" | "In Progress" | "Done";
}

export function TaskItem({ id, title, assignee, status }: TaskItemProps) {
    return (
        <div className="group flex items-center justify-between rounded-lg border border-border/40 bg-card/30 p-3 transition-all hover:bg-card/60">
            <div className="flex items-center gap-3">
                <button className="text-muted-foreground hover:text-primary transition-colors">
                    {status === "Done" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                        <Circle className="h-5 w-5" />
                    )}
                </button>
                <div>
                    <p className={cn("font-medium text-sm", status === "Done" && "text-muted-foreground line-through")}>
                        {title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {assignee}
                        </div>
                    </div>
                </div>
            </div>

            <Badge variant={
                status === "Done" ? "success" :
                    status === "In Progress" ? "warning" :
                        "outline"
            }>
                {status}
            </Badge>
        </div>
    );
}
