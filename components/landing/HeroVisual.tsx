"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, CheckSquare, DollarSign } from "lucide-react";

const MotionDiv = motion.div as any;

export default function HeroVisual() {
    return (
        <div className="relative h-[500px] w-full max-w-[600px] mx-auto lg:ml-auto">
            {/* Main Window Mockup */}
            <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden"
            >
                <div className="h-8 w-full bg-white/5 border-b border-white/10 flex items-center px-4 gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                    <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                    <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                </div>

                <div className="p-6 space-y-4">
                    <div className="h-4 w-1/3 rounded-full bg-white/10" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 rounded-xl bg-primary/10 border border-primary/20" />
                        <div className="h-32 rounded-xl bg-white/5 border border-white/10" />
                    </div>
                </div>
            </MotionDiv>

            {/* Floating Card – Workspace */}
            <MotionDiv
                animate={{ y: [0, -20, 0], rotate: [2, 0, 2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 p-4 rounded-xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-xl z-10 flex items-center gap-3 w-56"
            >
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <LayoutDashboard className="h-6 w-6" />
                </div>
                <div>
                    <div className="text-sm font-bold">Primary Workspace</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Active Environment
                    </div>
                </div>
            </MotionDiv>

            {/* Floating Card – Collaboration */}
            <MotionDiv
                animate={{ y: [0, 20, 0], rotate: [-3, -1, -3] }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute bottom-10 -right-10 p-4 rounded-xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-xl z-10 flex items-center gap-3 w-64"
            >
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <div className="text-sm font-bold">Collaboration Update</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        New Participants Added
                    </div>
                </div>
            </MotionDiv>

            {/* Floating Card – Tasks */}
            <MotionDiv
                animate={{ scale: [1, 1.05, 1], x: [0, 10, 0] }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
                className="absolute top-24 -right-20 p-4 rounded-xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-xl z-20 flex items-center gap-3 w-52"
            >
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                    <div className="text-sm font-bold text-amber-400">
                        3 Pending Items
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Requires Attention
                    </div>
                </div>
            </MotionDiv>

            {/* Floating Card – Resources */}
            <MotionDiv
                animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                }}
                className="absolute -bottom-8 left-12 p-4 rounded-xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-xl z-20 flex items-center gap-3 w-52"
            >
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <DollarSign className="h-6 w-6" />
                </div>
                <div>
                    <div className="text-sm font-bold">Resource Usage</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Tracked & Organized
                    </div>
                </div>
            </MotionDiv>
        </div>
    );
}
