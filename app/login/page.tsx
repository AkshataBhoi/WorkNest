"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";

const MotionDiv = motion.div as any;

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate authentication delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (email === "admin@worknest.com" && password === "admin123") {
            router.push("/dashboard");
        } else {
            setError("Invalid email or password");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background selection:bg-primary/20">
            {/* Left Section: Branding */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden bg-primary/5">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />

                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-md text-center"
                >
                    <Link href="/" className="inline-flex items-center gap-2 mb-12">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600" />
                        <span className="text-2xl font-bold tracking-tight text-foreground">WorkNest</span>
                    </Link>

                    <h1 className="text-4xl font-extrabold tracking-tight mb-6">
                        Welcome back to <span className="text-primary italic">WorkNest</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Manage projects, teams, and responsibilities in one unified workspace. Your productivity starts here.
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-primary mb-1">100+</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Teams Active</div>
                        </div>
                        <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Uptime</div>
                        </div>
                    </div>
                </MotionDiv>
            </div>

            {/* Right Section: Login Form */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <header className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600" />
                                <span className="text-2xl font-bold tracking-tight">WorkNest</span>
                            </Link>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
                        <p className="text-muted-foreground mt-2">Enter your details to access your dashboard</p>
                    </header>

                    <Card className="border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl">
                        <CardContent className="pt-6 space-y-6">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@worknest.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-10 p-2 bg-background/50 border-white/10 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-sm font-medium text-muted-foreground ml-1">
                                            Password
                                        </label>
                                        <button type="button" className="text-sm text-primary hover:underline transition-all">
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-10 p-2 bg-background/50 border-white/10 rounded-xl pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <MotionDiv
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                                    >
                                        {error}
                                    </MotionDiv>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Login
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-background/50 hover:bg-background/80 transition-all font-medium">
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-background/50 hover:bg-background/80 transition-all font-medium">
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M1 1h10v10H1zM13 1h10v10H13zM1 13h10v10H1zM13 13h10v10H13z" />
                                    </svg>
                                    Microsoft
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary font-medium hover:underline transition-all">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
