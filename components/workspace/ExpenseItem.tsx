"use client";

import { DollarSign, User } from "lucide-react";

interface ExpenseItemProps {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
}

export function ExpenseItem({ id, description, amount, paidBy }: ExpenseItemProps) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border/40 bg-card/30 p-3 transition-all hover:bg-card/60">
            <div>
                <p className="font-medium text-sm">{description}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <span className="text-xs">Paid by</span>
                    <User className="h-3 w-3" />
                    {paidBy}
                </div>
            </div>

            <div className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {amount.toFixed(2)}
            </div>
        </div>
    );
}
