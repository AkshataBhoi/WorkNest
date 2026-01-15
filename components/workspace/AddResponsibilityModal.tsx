"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Member, Project } from "@/lib/data";
import { X, Calendar, User, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddResponsibilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: { title: string; description: string; assignedTo: string[]; dueDate: string; projectId?: string }) => void;
    members: Member[];
    projects: Project[];
}

export function AddResponsibilityModal({ isOpen, onClose, onSave, members, projects }: AddResponsibilityModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState<string[]>([]);
    const [dueDate, setDueDate] = useState("");
    const [selectedProject, setSelectedProject] = useState<string>("");

    if (!isOpen) return null;

    const handleClose = () => {
        // Clear state
        setTitle("");
        setDescription("");
        setAssignedTo([]);
        setDueDate("");
        setSelectedProject("");
        onClose();
    };

    const handleSave = () => {
        if (!title.trim() || assignedTo.length === 0 || !dueDate) return;

        onSave({
            title,
            description,
            assignedTo,
            dueDate,
            projectId: selectedProject || undefined
        });
        handleClose();
    };

    const toggleMember = (memberId: string) => {
        setAssignedTo(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Add Responsibility</h2>
                    <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 rounded-full hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Input
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white/5 border-white/10 text-lg font-medium px-4 h-12 rounded-xl focus:ring-primary/20 transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" /> Due Date
                            </label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="bg-white/5 border-white/10 h-10 rounded-lg text-sm"
                            />
                        </div>

                        {/* Project */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Folder className="h-3 w-3" /> Project
                            </label>
                            <select
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#1A1A1E]">No Project</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id} className="bg-[#1A1A1E]">{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Assignees */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3 w-3" /> Assign To
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {members.map(member => {
                                const isSelected = assignedTo.includes(member.id);
                                return (
                                    <button
                                        key={member.id}
                                        onClick={() => toggleMember(member.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium",
                                            isSelected
                                                ? "bg-primary/20 border-primary text-primary"
                                                : "bg-white/5 border-white/5 hover:border-white/20 text-muted-foreground"
                                        )}
                                    >
                                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] text-white font-bold">
                                            {member.name.charAt(0)}
                                        </div>
                                        {member.name.split(" ")[0]}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <FileText className="h-3 w-3" /> Notes
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add any extra details..."
                            className="w-full h-24 p-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 h-11 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!title.trim() || assignedTo.length === 0 || !dueDate}
                        className="flex-1 h-11 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    >
                        Create Responsibility
                    </Button>
                </div>

            </div>
        </div>
    );
}
