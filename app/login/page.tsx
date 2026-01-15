"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/components/context/AuthContext";

const MotionDiv = motion.div as any;

export default function LoginPage() {
    const router = useRouter();
    const { login, register, googleLogin } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSignup) {
                setLoadingText("Creating account...");
                if (!name || !email || !password || !confirmPassword) throw new Error("Please fill in all fields");
                if (password !== confirmPassword) throw new Error("Passwords do not match");

                await register(name, email.trim(), password, "Member");
                setLoadingText("Redirecting...");
                router.push("/dashboard");
            } else {
                setLoadingText("Verifying credentials...");
                await login(email.trim(), password);
                setLoadingText("Redirecting...");
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setLoading(false);
            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                setError("Invalid email or password");
            } else if (err.code === "auth/email-already-in-use") {
                setError("Email already in use");
            } else {
                setError(err.message || "Authentication failed");
            }
        }
    };


    const handleGoogleLogin = async () => {
        setLoading(true);
        setLoadingText("Connecting to Google...");
        setError("");
        try {
            await googleLogin();
            setLoadingText("Redirecting...");
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Google login error:", err);
            if (err.code === "auth/popup-closed-by-user") {
                setError("Sign in cancelled");
            } else {
                setError("Google login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 selection:bg-violet-500/30 overflow-y-hidden">
            {/* Left Branding Section - Static */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-slate-900/50 border-r border-white/5">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
                    <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
                </div>

                <Link href="/" className="inline-block relative z-10 transition-transform hover:scale-105 active:scale-95">
                    <Logo size="lg" variant="gradient" />
                </Link>

                <div className="relative z-10 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                            Manage work <br />
                            across <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">any domain.</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                            WorkNest brings structure, collaboration, and clarity to teams across technology, operations, and finance.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-4">
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-white tracking-tight">10k+</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Users</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-white tracking-tight">99.9%</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Uptime Ready</div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest pt-8">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800" />
                        ))}
                    </div>
                    <span>Trusted by teams globally</span>
                </div>
            </div>

            {/* Right Form Section - Toggleable */}
            <div className="flex items-center justify-center p-5 sm:p-10  relative">
                <div className="w-full max-w-md space-y-10">
                    <div className="lg:hidden text-center mb-10">
                        <Logo size="xl" className="justify-center" />
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            {isSignup ? "Create account" : "Welcome back"}
                        </h1>
                        <p className="text-slate-400 font-medium">
                            {isSignup ? "Get started with WorkNest today" : "Sign in to access your dashboard"}
                        </p>
                    </div>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-8 sm:p-10">
                            <AnimatePresence mode="wait">
                                <MotionDiv
                                    key={isSignup ? "signup" : "login"}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <form onSubmit={handleAuth} className="space-y-5">
                                        {isSignup && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                                <Input
                                                    placeholder="John Doe"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="h-10 p-3 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-violet-500/50"
                                                    disabled={loading}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                            <Input
                                                type="email"
                                                placeholder="name@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-10 p-3 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-violet-500/50"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="space-y-2 relative">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="h-10 p-3 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-violet-500/50 pr-10"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {isSignup && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="h-10 p-3 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-violet-500/50"
                                                    disabled={loading}
                                                />
                                            </div>
                                        )}

                                        {error && (
                                            <p className="text-sm font-bold text-rose-400 bg-rose-400/10 py-3 px-4 rounded-2xl border border-rose-400/20">
                                                {error}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="h-12 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl shadow-violet-600/20 transition-all border border-white/10"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    {loadingText}
                                                </>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    {isSignup ? "Create Account" : "Sign In"}
                                                    <ArrowRight className="h-4 w-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </MotionDiv>
                            </AnimatePresence>

                            <div className="mt-8 space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/5" />
                                    </div>
                                    <div className="relative flex justify-center text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase">
                                        <span className="bg-[#0f172a] px-3">SSO Options</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button onClick={handleGoogleLogin} disabled={loading} variant="outline" className="h-11 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 text-xs font-bold">
                                        Google
                                    </Button>
                                    <Button disabled={loading} variant="outline" className="h-11 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 text-xs font-bold">
                                        Microsoft
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center -mt-6 text-sm font-medium text-slate-500">
                        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError("");
                            }}
                            className="text-white font-bold hover:underline underline-offset-4 decoration-violet-500 transition-all"
                            disabled={loading}
                        >
                            {isSignup ? "Log in here" : "Sign up free"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
