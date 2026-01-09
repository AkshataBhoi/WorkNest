"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, CheckSquare, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    {
        icon: LayoutDashboard,
        no: "1. ",
        title: "Create Workspace",
        description: "Launch your project hub in seconds.",
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/20",
    },
    {
        icon: Users,
        no: "2. ",
        title: "Invite Team",
        description: "Onboard members with unique codes.",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        borderColor: "border-emerald-400/20",
    },
    {
        icon: CheckSquare,
        no: "3. ",
        title: "Track Tasks",
        description: "Assign responsibilities and monitor progress.",
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        borderColor: "border-amber-400/20",
    },
    {
        icon: DollarSign,
        no: "4. ",
        title: "Split Expenses",
        description: "Log costs and settle up transparently.",
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/20",
    },
];

const MotionH2 = motion.h2 as any;
const MotionP = motion.p as any;
const MotionDiv = motion.div as any;

export function ProcessTimeline() {
    return (
        <section className="relative py-8 sm:py-12 md:py-15 lg:py-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-12">
                <div className="mb-12 sm:mb-16 lg:mb-24 text-center">
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium text-cyan-400 mb-4 sm:mb-6"
                    >
                        Seamless Experience
                    </MotionDiv>
                    <MotionH2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
                    >
                        Streamlined Workflow
                    </MotionH2>
                    <MotionP
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-4"
                    >
                        From setup to settlement, WorkNest handles the heavy lifting so you can focus on building what matters.
                    </MotionP>
                </div>

                <div className="border relative rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-10 md:p-14 shadow-2xl overflow-hidden group">
                    {/* Animated Gradient Border */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {/* Desktop Horizontal Straight Line */}
                    <div className="relative hidden lg:block">
                        {/* <div className="absolute top-[48px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />
                        <MotionDiv
                            initial={{ width: 0 }}
                            whileInView={{ width: "80%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            className="absolute top-[48px] left-[10%] h-px bg-gradient-to-r from-primary via-cyan-400 to-primary -z-10 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        /> */}

                        <div className="grid grid-cols-4 gap-12">
                            {STEPS.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <MotionDiv
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="flex flex-col items-center text-center group/item"
                                    >
                                        <div className={cn(
                                            "relative flex h-24 w-24 items-center justify-center rounded-[2rem] border bg-slate-950/50 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover/item:scale-110 group-hover/item:-translate-y-2 z-10 mb-8 border-white/10 group-hover/item:border-primary/50",
                                            step.color
                                        )}>
                                            <div className={cn("absolute inset-0 opacity-0 group-hover/item:opacity-20 rounded-[2rem] transition-opacity duration-500", step.bgColor)} />
                                            <Icon className="h-10 w-10 transition-transform duration-500 group-hover/item:rotate-6" />

                                            {/* Step Number Badge */}
                                            <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                {index + 1}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover/item:text-primary transition-colors">{step.title}</h3>
                                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed px-2 sm:px-4">
                                                {step.description}
                                            </p>
                                        </div>
                                    </MotionDiv>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Vertical Fallback */}
                    <div className="lg:hidden space-y-16 relative">
                        <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-primary via-cyan-400 to-primary opacity-20" />

                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <MotionDiv
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="relative pl-20 sm:pl-24 group/item"
                                >
                                    <div className={cn(
                                        "absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-2xl border bg-slate-950/50 backdrop-blur-xl shadow-xl z-10 border-white/10 group-hover/item:border-primary/50 transition-all",
                                        step.color
                                    )}>
                                        <div className={cn("absolute inset-0 opacity-10 rounded-2xl", step.bgColor)} />
                                        <Icon className="h-8 w-8" />
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-white">{step.title}</h3>
                                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </MotionDiv>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
