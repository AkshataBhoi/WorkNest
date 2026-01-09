"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/workspace");

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md"
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-12">
                <Link href="/" className="group flex items-center gap-2.5">
                    <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg transition-all group-hover:shadow-primary/40 group-hover:scale-105">
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        WorkNest
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {!isDashboard ? (
                        <>
                            {/* <Link href="/signup" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-semibold">
                                Sign Up
                            </Link> */}
                            <Link href="/login">
                                <Button className="relative overflow-hidden rounded-full px-8 py-5 text-sm font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-primary/25 active:scale-95 bg-gradient-to-r from-primary/80 to-purple-600/80 border border-white/10 backdrop-blur-sm">
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="rounded-full px-6 hover:bg-white/5">
                                Log Out
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
