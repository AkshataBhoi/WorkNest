"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { useAuth } from "@/components/context/AuthContext";
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
    Filter,
    X,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionDiv = motion.div as any;

export default function ProjectExpensesPage() {
    const params = useParams();
    const router = useRouter();
    const { currentUser } = useAuth();
    const { getWorkspaceById, addExpense, updateExpenseStatus, updateProjectStatus } = useWorkspaces();

    const workspaceId = params.id as string;
    const projectId = params.projectId as string;

    const workspace = getWorkspaceById(workspaceId);
    const project = workspace?.projects.find(p => p.id === projectId);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        title: "",
        amount: "",
        paidById: currentUser?.id || "",
        status: "Paid" as "Paid" | "Pending" | "Cleared"
    });
    const [splitBetweenIds, setSplitBetweenIds] = useState<string[]>(workspace?.members.map(m => m.id) || []);

    const splitAmount = parseFloat(newExpense.amount) && splitBetweenIds.length > 0
        ? (parseFloat(newExpense.amount) / splitBetweenIds.length).toFixed(2)
        : "0.00";

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
        if (!newExpense.title || !newExpense.amount || !newExpense.paidById || splitBetweenIds.length === 0) return;

        addExpense(workspaceId, projectId, {
            title: newExpense.title,
            amount: parseFloat(newExpense.amount),
            paidById: newExpense.paidById,
            splitBetween: splitBetweenIds,
            status: newExpense.status
        });

        setNewExpense({ title: "", amount: "", paidById: currentUser?.id || "", status: "Paid" });
        setSplitBetweenIds(workspace?.members.map(m => m.id) || []);
        setIsAddModalOpen(false);
    };

    const toggleMember = (id: string) => {
        setSplitBetweenIds(prev =>
            prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (splitBetweenIds.length === workspace?.members.length) {
            setSplitBetweenIds([]);
        } else {
            setSplitBetweenIds(workspace?.members.map(m => m.id) || []);
        }
    };

    // Calculate computed total expense (excluding cleared)
    const activeExpenses = project.expenses.filter(e => e.status !== "Cleared");
    const computedTotalExpense = activeExpenses.reduce((acc, e) => acc + e.amount, 0);

    // Calculate contribution breakdown
    const contributions = workspace.members.map(member => {
        // Amount this member paid (excluding cleared)
        const paid = activeExpenses
            .filter(e => e.paidById === member.id)
            .reduce((acc, e) => acc + e.amount, 0);

        // Amount this member is responsible for (excluding cleared)
        const share = activeExpenses.reduce((acc, e) => {
            if (e.splitBetween && e.splitBetween.includes(member.id)) {
                return acc + (e.amount / e.splitBetween.length);
            }
            return acc;
        }, 0);

        const balance = paid - share;
        const percentage = computedTotalExpense > 0 ? (paid / computedTotalExpense) * 100 : 0;

        return { ...member, paid, share, balance, percentage };
    }).sort((a, b) => b.paid - a.paid);

    // Calculate Suggested Settlements (Greedy Algorithm)
    const getSettlements = () => {
        const debtors = contributions
            .filter(c => c.balance < -0.01)
            .map(c => ({ ...c, amount: Math.abs(c.balance) }))
            .sort((a, b) => b.amount - a.amount);

        const creditors = contributions
            .filter(c => c.balance > 0.01)
            .map(c => ({ ...c, amount: c.balance }))
            .sort((a, b) => b.amount - a.amount);

        const settlements: { from: string, to: string, amount: number }[] = [];

        let i = 0; // debtor index
        let j = 0; // creditor index

        while (i < debtors.length && j < creditors.length) {
            const amount = Math.min(debtors[i].amount, creditors[j].amount);
            settlements.push({
                from: debtors[i].name,
                to: creditors[j].name,
                amount: amount
            });

            debtors[i].amount -= amount;
            creditors[j].amount -= amount;

            if (debtors[i].amount < 0.01) i++;
            if (creditors[j].amount < 0.01) j++;
        }

        return settlements;
    };

    const suggestedSettlements = getSettlements();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-4 max-w-6xl">
                <PageTransition>
                    <div className="mb-6">
                        <Link href={`/workspace/${workspace.id}`} className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors mb-4 group">
                            <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
                            Back to Workspace
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-black text-tranform: capitalize tracking-tight">{project.name}</h1>
                                    <div className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {workspace.name}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">Total Cost</span>
                                        <span className="text-xl font-black text-foreground">₹{project.totalExpense.toLocaleString()}</span>
                                    </div>
                                    <div className="h-8 w-px bg-white/10" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">Expenses</span>
                                        <span className="text-xl font-black text-primary">{project.expenses.length}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="rounded-xl h-11 px-6 text-sm font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Expense
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Expense List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-panel p-6 rounded-3xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <IndianRupee className="h-5 w-5 text-primary" />
                                        Expense Log
                                    </h2>
                                    <div className="hidden lg:flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 border-white/10 bg-white/5">
                                            <Filter className="h-3.5 w-3.5 mr-2 opacity-60" />
                                            Filter
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {project.expenses.length > 0 ? (
                                        <div className="space-y-2">
                                            {[...project.expenses]
                                                .reverse()
                                                .map((expense) => {
                                                    const paidBy = workspace.members.find(m => m.id === expense.paidById);
                                                    return (
                                                        <div key={expense.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <div className="h-8 w-8 sm:h-8 sm:w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                                    <IndianRupee className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-sm leading-tight">{expense.title}</h4>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                                            {paidBy?.name.split(" ")[0]} paid ₹{expense.amount.toLocaleString()}
                                                                        </span>
                                                                        <span className="text-[10px] text-muted-foreground">•</span>
                                                                        <div className="flex -space-x-1">
                                                                            {expense.splitBetween?.map((id) => {
                                                                                const mem = workspace.members.find(m => m.id === id);
                                                                                return (
                                                                                    <div key={id} title={mem?.name} className="h-4 w-4 rounded-full bg-white/10 border border-background flex items-center justify-center text-[8px] font-bold">
                                                                                        {mem?.name[0]}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-[80%] sm:w-auto flex items-center justify-between sm:justify-end gap-4">
                                                                <select
                                                                    value={expense.status}
                                                                    onChange={(e) => updateExpenseStatus(workspaceId, projectId, expense.id, e.target.value as any)}
                                                                    className={cn(
                                                                        "text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-background/80 border rounded-lg px-3 py-2 sm:px-2 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all flex-1 sm:flex-none min-w-[100px] sm:min-w-0",
                                                                        expense.status === "Paid" ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" :
                                                                            expense.status === "Pending" ? "text-amber-500 border-amber-500/30 bg-amber-500/10" : "text-indigo-500 border-indigo-500/30 bg-indigo-500/10"
                                                                    )}
                                                                >
                                                                    <option value="Paid" className="bg-background">Paid</option>
                                                                    <option value="Pending" className="bg-background">Pending</option>
                                                                    <option value="Cleared" className="bg-background">Cleared</option>
                                                                </select>
                                                                <div className="flex flex-col items-end shrink-0">
                                                                    <span className="font-black text-sm">₹{expense.amount.toLocaleString()}</span>
                                                                    <span className="text-[9px] text-muted-foreground">{expense.date}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
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
                            <div className="glass-panel p-6 rounded-3xl space-y-6">
                                {/* Summary Header Row */}
                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">Members</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Users className="h-3 w-3 text-primary" />
                                                <span className="text-sm font-black">{workspace.members.length}</span>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-white/5" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">Total Expense</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <IndianRupee className="h-3 w-3 text-emerald-500" />
                                                <span className="text-sm font-black text-foreground">₹{computedTotalExpense.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-xl border",
                                        suggestedSettlements.length === 0
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                    )}>
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">
                                            {suggestedSettlements.length === 0 ? "All Settled" : "Settlements Pending"}
                                        </span>
                                    </div>
                                </div>

                                {/* Horizontal Member Strip */}
                                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                                    {contributions.map((c) => (
                                        <div key={c.id} className="flex-shrink-0 w-[140px] p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="h-7 w-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/20">
                                                    {c.name[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-[11px] font-bold truncate">{c.name.split(" ")[0]}</h4>
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-center",
                                                c.balance > 0.01 ? "bg-emerald-500/10 text-emerald-500" :
                                                    c.balance < -0.01 ? "bg-rose-500/10 text-rose-500" : "bg-white/5 text-muted-foreground/60"
                                            )}>
                                                {c.balance > 0.01
                                                    ? `Receive ₹${c.balance.toFixed(0)}`
                                                    : c.balance < -0.01
                                                        ? `Pay ₹${Math.abs(c.balance).toFixed(0)}`
                                                        : "Settled"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contribution Breakdown */}
                        <div className="space-y-6">
                            {/* Horizontal Team Summary */}


                            {/* Conditional Suggested Settlements */}
                            {suggestedSettlements.length > 0 && (
                                <MotionDiv
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel p-6 rounded-3xl bg-indigo-500/5 border-indigo-500/20"
                                >
                                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                        <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                                        Suggested Settlements
                                    </h2>

                                    <div className="grid grid-cols-1 gap-3">
                                        {suggestedSettlements.map((s, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-background/40 border border-white/5 flex items-center justify-between relative group overflow-hidden">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black mb-1">{s.from}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-foreground opacity-80">Pays</span>
                                                            <span className="text-sm font-black text-rose-500">₹{s.amount.toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                    <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180 opacity-30" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black mb-1">To {s.to}</span>
                                                        <span className="text-xs font-bold text-emerald-500">Action Required</span>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </MotionDiv>
                            )}

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

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden glass-panel relative"
                        >
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-black tracking-tight">Add Expense</h2>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">New project transaction</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <IndianRupee className="h-5 w-5" />
                                    </div>
                                </div>

                                <form onSubmit={handleAddExpense} className="space-y-4">
                                    {/* Description */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-end px-1">
                                            <label className="text-[9px] uppercase tracking-widest font-black text-muted-foreground">Description</label>
                                            <span className="text-[9px] text-muted-foreground opacity-50">{newExpense.title.length}/50</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            maxLength={50}
                                            value={newExpense.title}
                                            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                            placeholder="e.g. Team lunch, Domain purchase"
                                            className="w-full h-11 px-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] uppercase tracking-widest font-black text-muted-foreground px-1">Amount</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                                            <input
                                                type="number"
                                                required
                                                step="any"
                                                value={newExpense.amount}
                                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                placeholder="0"
                                                className="w-full h-11 pl-8 pr-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm text-right font-bold"
                                            />
                                        </div>
                                        {parseFloat(newExpense.amount) <= 0 && newExpense.amount !== "" && (
                                            <p className="text-[9px] text-rose-500 font-bold px-1">Amount must be greater than zero</p>
                                        )}
                                    </div>

                                    {/* Paid By & Status */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] uppercase tracking-widest font-black text-muted-foreground px-1">Paid By</label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={newExpense.paidById}
                                                    onChange={(e) => setNewExpense({ ...newExpense, paidById: e.target.value })}
                                                    className="w-full h-11 px-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-xs appearance-none cursor-pointer pr-10"
                                                >
                                                    {workspace.members.map(m => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                                <Users className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none opacity-50" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] uppercase tracking-widest font-black text-muted-foreground px-1">Status</label>
                                            <select
                                                required
                                                value={newExpense.status}
                                                onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value as any })}
                                                className="w-full h-11 px-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-xs appearance-none cursor-pointer"
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Cleared">Cleared</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Split Between */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2">
                                                <label className="text-[9px] uppercase tracking-widest font-black text-muted-foreground">Split Between</label>
                                                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-bold">{splitBetweenIds.length} Members</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={toggleAll}
                                                className="text-[9px] font-black text-primary hover:underline uppercase tracking-wider"
                                            >
                                                {splitBetweenIds.length === workspace.members.length ? "Deselect All" : "Select All"}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                                            {workspace.members.map(member => (
                                                <div
                                                    key={member.id}
                                                    onClick={() => toggleMember(member.id)}
                                                    className={cn(
                                                        "flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer",
                                                        splitBetweenIds.includes(member.id)
                                                            ? "bg-primary/5 border-primary/20"
                                                            : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-3.5 w-3.5 rounded-sm border flex items-center justify-center transition-all",
                                                        splitBetweenIds.includes(member.id)
                                                            ? "bg-primary border-primary text-white"
                                                            : "border-white/20"
                                                    )}>
                                                        {splitBetweenIds.includes(member.id) && <Check className="h-2.5 w-2.5" />}
                                                    </div>
                                                    <div className="h-5 w-5 rounded-md bg-indigo-500/10 flex items-center justify-center text-[9px] font-black text-indigo-500">
                                                        {member.name[0]}
                                                    </div>
                                                    <span className="text-[11px] font-bold truncate">{member.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {splitBetweenIds.length === 0 && (
                                            <p className="text-[9px] text-rose-500 font-bold px-1">Select at least one member to split with</p>
                                        )}
                                    </div>

                                    {/* Auto Split Preview */}
                                    {parseFloat(newExpense.amount) > 0 && splitBetweenIds.length > 0 && (
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between"
                                        >
                                            <span className="text-[9px] text-emerald-500 uppercase tracking-widest font-black">Each person pays</span>
                                            <span className="text-sm font-black text-emerald-500">₹{splitAmount}</span>
                                        </MotionDiv>
                                    )}

                                    <div className="flex flex-col gap-2 pt-2">
                                        <Button
                                            type="submit"
                                            disabled={!newExpense.title || !newExpense.amount || parseFloat(newExpense.amount) <= 0 || splitBetweenIds.length === 0}
                                            className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 text-sm group"
                                        >
                                            Add Expense
                                            <Plus className="ml-2 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="w-full text-center text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-foreground transition-colors py-1.5"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
