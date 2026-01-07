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

export function ProcessTimeline() {
    return (
        <section className="relative py-24 sm:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
                    >
                        Streamlined Workflow
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        From setup to settlement, WorkNest handles the details so you can focus on building.
                    </motion.p>
                </div>

                {/* Desktop Horizontal Straight Line */}
                <div className="relative hidden md:block mt-12">
                    {/* Straight Connecting Line */}
                    <div className="absolute top-[40px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                    <div className="absolute top-[40px] left-[10%] max-w-[80%] w-full h-0.5 bg-gradient-to-r from-primary/20 via-accent/50 to-purple-500/20 -z-10" />

                    <div className="grid grid-cols-4 gap-8">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    {/* Icon Node */}
                                    <div className={cn(
                                        "relative flex h-20 w-20 items-center justify-center rounded-full border bg-background shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/25 z-10 mb-6",
                                        step.borderColor,
                                        step.color
                                    )}>
                                        <div className={cn("absolute inset-0 opacity-20 rounded-full", step.bgColor)} />
                                        <Icon className="h-9 w-9" />
                                    </div>

                                    {/* Text Content */}
                                    <div className="relative px-2">
                                        <h3 className="text-xl font-bold mb-3">{step.no} {step.title}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Vertical Fallback */}
                <div className="md:hidden space-y-12 relative mt-8">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/20 via-accent/50 to-purple-500/20" />

                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative pl-16 pr-4"
                            >
                                <div className={cn(
                                    "absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border bg-card shadow-sm z-10",
                                    step.borderColor,
                                    step.color
                                )}>
                                    <div className={cn("absolute inset-0 opacity-10 rounded-full", step.bgColor)} />
                                    <Icon className="h-6 w-6" />
                                </div>

                                <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
