"use client";

import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

export default function PremiumBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#020617]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#020617] to-slate-950" />

            {/* Radial Glows */}
            <MotionDiv
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[10%] -left-[10%] h-[70%] w-[70%] rounded-full bg-primary/20 blur-[120px]"
            />

            <MotionDiv
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-cyan-500/10 blur-[100px]"
            />

            {/* Subtle Noise / Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>
    );
}
