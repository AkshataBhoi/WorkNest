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
}

export function GmailAccountPicker({ open, onOpenChange, onSelectAccount }: GmailAccountPickerProps) {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

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
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Choose an account</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        to continue to WorkNest
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-4">
                    {MOCK_GMAIL_ACCOUNTS.map((account) => (
                        <button
                            key={account.id}
                            onClick={() => handleSelect(account)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                                "hover:bg-white/5 hover:border-primary/30",
                                selectedId === account.id
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
                            {selectedId === account.id && (
                                <Check className="h-5 w-5 text-primary shrink-0" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>Select the account you want to use for this workspace</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
