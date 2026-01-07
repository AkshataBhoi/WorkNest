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
            className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl"
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600" />
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        WorkNest
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    {!isDashboard ? (
                        <Link href="/dashboard">
                            <Button variant="primary" size="sm" className="shadow-none">
                                Login
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                Log Out
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
