"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Plus,
    IndianRupee,
    Users,
    PieChart,
    Clock,
    CheckCircle2,
    Trash2,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionDiv = motion.div as any;

export default function ProjectExpensesPage() {
    const params = useParams();
    const router = useRouter();
    const { getWorkspaceById, addExpense, updateExpenseStatus } = useWorkspaces();

    const workspaceId = params.id as string;
    const projectId = params.projectId as string;

    const workspace = getWorkspaceById(workspaceId);
    const project = workspace?.projects.find(p => p.id === projectId);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        title: "",
        amount: "",
        paidById: ""
    });

    if (!workspace || !project) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Project or Workspace not found</h1>
                <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            </div>
        );
    }

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExpense.title || !newExpense.amount || !newExpense.paidById) return;

        addExpense(workspaceId, projectId, {
            title: newExpense.title,
            amount: parseFloat(newExpense.amount),
            paidById: newExpense.paidById,
            status: "Paid"
        });

        setNewExpense({ title: "", amount: "", paidById: "" });
        setIsAddModalOpen(false);
    };

    // Calculate contribution breakdown
    const contributions = workspace.members.map(member => {
        const total = project.expenses
            .filter(e => e.paidById === member.id)
            .reduce((acc, e) => acc + e.amount, 0);
        const percentage = project.totalExpense > 0 ? (total / project.totalExpense) * 100 : 0;
        return { ...member, total, percentage };
    }).sort((a, b) => b.total - a.total);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                <PageTransition>
                    <div className="mb-8">
                        <Link href={`/workspace/${workspace.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Workspace
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-extrabold tracking-tight">{project.name} Expenses</h1>
                                    <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {workspace.name}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Total Project Cost</span>
                                        <span className="text-3xl font-black text-foreground">₹{project.totalExpense.toLocaleString()}</span>
                                    </div>
                                    <div className="h-10 w-px bg-white/10" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Total Expenses</span>
                                        <span className="text-3xl font-black text-primary">{project.expenses.length}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="rounded-2xl h-14 px-8 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all gap-2"
                            >
                                <Plus className="h-5 w-5" />
                                Add Expense
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                        {/* Expense List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-panel p-6 rounded-3xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <IndianRupee className="h-5 w-5 text-primary" />
                                        Expense Log
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 border-white/10 bg-white/5">
                                            <Filter className="h-3.5 w-3.5 mr-2 opacity-60" />
                                            Filter
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {project.expenses.length > 0 ? (
                                        project.expenses.map((expense) => {
                                            const paidBy = workspace.members.find(m => m.id === expense.paidById);
                                            return (
                                                <div
                                                    key={expense.id}
                                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-background/40 border border-white/5 hover:border-primary/20 transition-all hover:bg-background/60"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                                            <IndianRupee className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm lg:text-base">{expense.title}</h4>
                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                                <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Users className="h-3 w-3" />
                                                                    {paidBy?.name}
                                                                </span>
                                                                <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                                                                    {expense.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                                                        <div className="text-right">
                                                            <span className="block font-black text-lg">₹{expense.amount.toLocaleString()}</span>
                                                            <select
                                                                value={expense.status}
                                                                onChange={(e) => updateExpenseStatus(workspaceId, projectId, expense.id, e.target.value as any)}
                                                                className={cn(
                                                                    "text-[10px] font-bold uppercase tracking-wider bg-transparent border-none p-0 focus:ring-0 cursor-pointer transition-colors",
                                                                    expense.status === "Paid" ? "text-emerald-400" :
                                                                        expense.status === "Pending" ? "text-amber-400" : "text-indigo-400"
                                                                )}
                                                            >
                                                                <option value="Paid" className="bg-background text-foreground">Paid</option>
                                                                <option value="Pending" className="bg-background text-foreground">Pending</option>
                                                                <option value="Cleared" className="bg-background text-foreground">Cleared</option>
                                                            </select>
                                                        </div>
                                                        {/* Optional Delete for demo clarity if needed */}
                                                        {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/60 hover:text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button> */}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-20 text-center">
                                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-white/5 border border-white/10 mb-4">
                                                <IndianRupee className="h-8 w-8 text-muted-foreground opacity-20" />
                                            </div>
                                            <p className="text-muted-foreground">No expenses recorded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contribution Breakdown */}
                        <div className="space-y-8">
                            <div className="glass-panel p-6 rounded-3xl">
                                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                    <PieChart className="h-5 w-5 text-primary" />
                                    Team Contribution
                                </h2>

                                <div className="space-y-5">
                                    {contributions.map((c) => (
                                        <div key={c.id} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span className="text-muted-foreground truncate max-w-[120px]">{c.name}</span>
                                                <span className="text-foreground">₹{c.total.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                                                <MotionDiv
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${c.percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-primary to-indigo-500"
                                                />
                                            </div>
                                            <div className="text-[10px] text-right text-muted-foreground uppercase tracking-widest font-bold">
                                                {c.percentage.toFixed(1)}% Contribution
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-3xl bg-primary/5 border-primary/20">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Quick Rule</h3>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            Any team member can add expenses and change status. Only Workspace Owners can change Project Status.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PageTransition>
            </main>

            <Footer />

            {/* Add Expense Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden glass-panel"
                        >
                            <div className="p-8 md:p-10">
                                <h2 className="text-2xl font-black mb-2">Add New Expense</h2>
                                <p className="text-muted-foreground text-sm mb-8">Record a new team expenditure for {project.name}.</p>

                                <form onSubmit={handleAddExpense} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Expense Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={newExpense.title}
                                            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                            placeholder="e.g. Server Hosting"
                                            className="w-full h-14 px-6 rounded-2xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-base"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Amount (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                value={newExpense.amount}
                                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full h-14 px-6 rounded-2xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-base"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Paid By</label>
                                            <select
                                                required
                                                value={newExpense.paidById}
                                                onChange={(e) => setNewExpense({ ...newExpense, paidById: e.target.value })}
                                                className="w-full h-14 px-6 rounded-2xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-base"
                                            >
                                                <option value="" disabled className="bg-background">Select Member</option>
                                                {workspace.members.map(m => (
                                                    <option key={m.id} value={m.id} className="bg-background text-foreground">{m.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 h-14 rounded-2xl font-bold"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-[2] h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                                        >
                                            Save Expense
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
