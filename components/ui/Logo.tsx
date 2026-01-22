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
        <div className={cn("flex items-center gap-3 group", className)}>
            <div className={cn(
                "relative flex shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-xl transition-all duration-500 group-hover:shadow-primary/40 group-hover:-translate-y-0.5",
                sizes[size],
                "bg-slate-950 border border-white/10"
            )}>
                {/* Stylized Building + Team Concept - Inspired by User Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-indigo-600/10" />

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 w-2/3 h-2/3 transition-transform duration-500 group-hover:scale-110"
                >
                    {/* Buildings */}
                    <rect x="4" y="8" width="4" height="12" rx="1" fill="currentColor" className="text-primary/40" />
                    <rect x="9" y="4" width="6" height="16" rx="1.5" fill="currentColor" className="text-primary" />
                    <rect x="16" y="8" width="4" height="12" rx="1" fill="currentColor" className="text-primary/40" />

                    {/* Team Silhouettes (Stylized) */}
                    <circle cx="6" cy="16" r="1.5" fill="currentColor" className="text-white" />
                    <circle cx="12" cy="14" r="2" fill="currentColor" className="text-white" />
                    <circle cx="18" cy="16" r="1.5" fill="currentColor" className="text-white" />

                    <path d="M4 22C4 20.3431 5.34315 19 7 19H5C3.34315 19 2 20.3431 2 22" fill="currentColor" className="text-white/60" />
                    <path d="M9 22C9 19.7909 10.7909 18 13 18H11C8.79086 18 7 19.7909 7 22" fill="currentColor" className="text-white" />
                    <path d="M17 22C17 20.3431 18.3431 19 20 19H22C22 20.3431 20.6569 19 19 19" fill="currentColor" className="text-white/60" />
                </svg>

                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className={cn(
                "font-black tracking-tight transition-all duration-300",
                textSizes[size],
                variant === "gradient"
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50"
                    : "text-slate-200 group-hover:text-white"
            )}>
                Work<span className="text-primary group-hover:text-white transition-colors">Nest</span>
            </span>
        </div>
    );
}
