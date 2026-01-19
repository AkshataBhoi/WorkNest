"use client";

import { useState } from "react";
import {
    MoreVertical,
    UserMinus,
    Trash2,
    AlertTriangle,
    Loader2,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { Workspace, Member } from "@/lib/data";
import { cn } from "@/lib/utils";

interface WorkspaceActionsProps {
    workspace: Workspace;
    onActionComplete?: () => void;
}

export function WorkspaceActions({ workspace, onActionComplete }: WorkspaceActionsProps) {
    const { removeMember, deleteWorkspace, getUserRole } = useWorkspaces();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    const userRole = getUserRole(workspace.id);
    const isAdmin = userRole === "Admin";

    if (!isAdmin) return null;

    const handleDeleteWorkspace = async () => {
        setIsLoading(true);
        try {
            await deleteWorkspace(workspace.id);
            setIsDeleteDialogOpen(false);
            onActionComplete?.();
        } catch (error) {
            console.error(error);
            alert("Failed to delete workspace. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async () => {
        if (!selectedMemberId) return;
        setIsLoading(true);
        try {
            await removeMember(workspace.id, selectedMemberId);
            setIsRemoveMemberOpen(false);
            setSelectedMemberId(null);
            onActionComplete?.();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to remove member.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-5 p-0 hover:bg-white/10 rounded-xl"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl p-1 shadow-xl"
                >
                    <DropdownMenuItem
                        onClick={() => setIsRemoveMemberOpen(true)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm cursor-pointer hover:bg-white/10 transition-all"
                    >
                        <UserMinus className="h-4 w-4 text-primary" />
                        <span>Remove Member</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm cursor-pointer text-rose-400 hover:bg-rose-400/10 transition-all font-medium"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Workspace</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0F0F12] border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                        <Trash2 className="h-24 w-24 text-rose-500" />
                    </div>

                    <DialogHeader className="relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 ring-1 ring-rose-500/20">
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-white mb-2">
                            Delete Workspace?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium leading-relaxed">
                            This action is permanent. All projects, tasks, and expenses in <span className="text-white font-bold">{workspace.name}</span> will be lost forever.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-8 gap-3 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteWorkspace}
                            disabled={isLoading}
                            className="h-12 px-8 rounded-xl bg-rose-500 text-white hover:bg-rose-600  shadow-xl shadow-rose-500/20 font-black uppercase tracking-widest text-[10px]"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Forever"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Member Modal */}
            <Dialog open={isRemoveMemberOpen} onOpenChange={setIsRemoveMemberOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0F0F12] border-white/10 rounded-[2.5rem] shadow-2xl p-8">
                    <DialogHeader>
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
                            <UserMinus className="h-7 w-7" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-white mb-2">
                            Remove Team Member
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium">
                            Select a member to remove from <span className="text-white font-bold">{workspace.name}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {workspace.members.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => setSelectedMemberId(member.id)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                    selectedMemberId === member.id
                                        ? "bg-primary/10 border-primary/30"
                                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-xs font-black text-primary border border-white/5 shadow-inner">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-white">{member.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-60">
                                            {member.role || "Member"}
                                        </span>
                                    </div>
                                </div>
                                {selectedMemberId === member.id && (
                                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                                        ✓
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-8 gap-3 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRemoveMemberOpen(false);
                                setSelectedMemberId(null);
                            }}
                            className="h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRemoveMember}
                            disabled={isLoading || !selectedMemberId}
                            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove Member"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
