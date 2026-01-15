"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Folder } from "lucide-react";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

export function AddProjectModal({ isOpen, onClose, onSave }: AddProjectModalProps) {
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setName("");
        onClose();
    };

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name);
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-tight">New Project</h2>
                    <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 rounded-full hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Folder className="h-3 w-3" /> Project Name
                        </label>
                        <Input
                            placeholder="e.g. Website Redesign"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/5 border-white/10 h-10 rounded-lg text-sm transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 h-10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="flex-1 h-10 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    >
                        Add Project
                    </Button>
                </div>

            </div>
        </div>
    );
}
