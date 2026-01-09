"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "flat" | "gradient";
}

export default function Logo({ className, size = "md", variant = "flat" }: LogoProps) {
    const sizes = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
        xl: "h-12 w-12",
    };

    const textSizes = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
        xl: "text-3xl",
    };

    return (
        <div className={cn("flex items-center gap-2.5 group", className)}>
            <div className={cn(
                "relative flex shrink-0 items-center justify-center rounded-xl overflow-hidden transition-all group-hover:scale-110 shadow-lg",
                sizes[size],
                "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 shadow-violet-500/20"
            )}>
                {/* Simple modern icon - rounded square with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/80 via-indigo-500/80 to-blue-500/80 rounded-xl" />
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </div>
            <span className={cn(
                "font-extrabold tracking-tight transition-colors",
                textSizes[size],
                variant === "gradient" ? "text-white" : "text-slate-200 group-hover:text-white"
            )}>
                WorkNest
            </span>
        </div>
    );
}
