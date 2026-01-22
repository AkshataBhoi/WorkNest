"use client";

import * as React from "react";
import { GmailAccount, MOCK_GMAIL_ACCOUNTS } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GmailAccountPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectAccount: (account: GmailAccount) => void;
    currentUser?: { name: string | null; email: string | null; id: string } | null;
}

export function GmailAccountPicker({ open, onOpenChange, onSelectAccount, currentUser }: GmailAccountPickerProps) {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    // Auto-select effect if needed, or just let user click to confirm
    // The prompt says "Auto-selected", which could mean visually selected or skipping step.
    // Given "Show ONLY...", user likely needs to see and confirm (click).

    // Construct accounts list based on auth state
    const accounts: GmailAccount[] = React.useMemo(() => {
        if (currentUser && currentUser.email) {
            return [{
                id: currentUser.id,
                name: currentUser.name || "User",
                email: currentUser.email,
                type: 'work', // Default to work for authenticated context
                avatar: ""
            }];
        }
        return MOCK_GMAIL_ACCOUNTS;
    }, [currentUser]);

    const handleSelect = (account: GmailAccount) => {
        setSelectedId(account.id);
        setTimeout(() => {
            onSelectAccount(account);
            onOpenChange(false);
            setSelectedId(null);
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-black">
                        {currentUser ? "Confirm Account" : "Choose an account"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        to join this workspace
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-4">
                    {accounts.map((account) => (
                        <button
                            key={account.id}
                            onClick={() => handleSelect(account)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                                "hover:bg-white/5 hover:border-primary/30",
                                (selectedId === account.id || accounts.length === 1) // Auto-highlight if single
                                    ? "bg-primary/10 border-primary/50"
                                    : "bg-background/50 border-white/10"
                            )}
                        >
                            {/* Avatar */}
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0">
                                {account.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>

                            {/* Account Info */}
                            <div className="flex-1 text-left min-w-0">
                                <div className="font-semibold text-sm truncate">{account.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{account.email}</div>
                            </div>

                            {/* Type Badge */}
                            <div className={cn(
                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0",
                                account.type === 'work'
                                    ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                                    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            )}>
                                {account.type}
                            </div>

                            {/* Check Icon */}
                            {(selectedId === account.id || accounts.length === 1) && (
                                <Check className="h-5 w-5 text-primary shrink-0" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>
                        {currentUser
                            ? "You are securely logged in."
                            : "Select the account you want to use for this workspace"}
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
