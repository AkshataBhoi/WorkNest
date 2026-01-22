"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  UserMinus,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  ExternalLink,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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

export function WorkspaceActions({
  workspace,
  onActionComplete,
}: WorkspaceActionsProps) {
  const { removeMember, deleteWorkspace, getUserRole } = useWorkspaces();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const router = useRouter();
  const userRole = getUserRole(workspace.id);
  const isAdmin = userRole === "Admin";

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

  function useIsMobile(breakpoint = 650) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
      const handler = () => setIsMobile(mq.matches);
      handler();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, [breakpoint]);

    return isMobile;
  }
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  return (
    <div className="flex items-center">
      {!isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all border border-white/5 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl border border-white/10 bg-card/90 backdrop-blur-xl p-1 shadow-2xl z-[100]"
          >
            <DropdownMenuItem
              onClick={() => router.push(`/workspace/${workspace.id}/expenses`)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm cursor-pointer hover:bg-white/10 transition-all font-medium"
            >
              <Wallet className="h-4 w-4 text-emerald-400" />
              <span>View Expenses</span>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={() => setIsRemoveMemberOpen(true)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm cursor-pointer hover:bg-white/10 transition-all font-medium"
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {isMobile && (
        <>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {mobileMenuOpen &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Actions</span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 rounded-full hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* View Expenses */}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push(`/workspace/${workspace.id}/expenses`);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-white/5 text-sm font-bold hover:bg-white/10 transition border border-white/5"
                    >
                      <Wallet className="h-4 w-4 text-emerald-400" />
                      View Expenses
                    </button>

                    {isAdmin && (
                      <>
                        {/* Remove Member */}
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setIsRemoveMemberOpen(true);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-white/5 text-sm font-bold hover:bg-white/10 transition border border-white/5"
                        >
                          <UserMinus className="h-4 w-4 text-primary" />
                          Remove Member
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-rose-500/10 text-rose-400 text-sm font-bold hover:bg-rose-500/20 transition border border-rose-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Workspace
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>,
              document.body
            )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className="
          bg-[#0F0F12] border-white/10
          rounded-[2rem] shadow-2xl
          w-[90vw] max-w-md
          max-h-[85vh] overflow-y-auto
          p-6 sm:p-8
        "
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none hidden sm:block">
            <Trash2 className="h-24 w-24 text-rose-500" />
          </div>

          <DialogHeader className="relative z-10">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 sm:mb-6 ring-1 ring-rose-500/20">
              <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-black text-white mb-2">
              Delete Workspace?
            </DialogTitle>

            <DialogDescription className="text-sm sm:text-base text-muted-foreground font-medium">
              This action is permanent. All projects, tasks, and expenses in{" "}
              <span className="text-white font-bold">{workspace.name}</span>{" "}
              will be lost forever.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-11 sm:h-12 w-full sm:w-auto px-6 rounded-xl"
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteWorkspace}
              disabled={isLoading}
              className="h-11 sm:h-12 w-full sm:w-auto px-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Forever"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Modal */}
      <Dialog open={isRemoveMemberOpen} onOpenChange={setIsRemoveMemberOpen}>
        <DialogContent
          className="
          bg-[#0F0F12] border-white/10
          rounded-[2rem] shadow-2xl
          w-[90vw] max-w-md
          max-h-[85vh] overflow-y-auto
          p-6 sm:p-8
        "
        >

          <DialogHeader>
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-6 ring-1 ring-primary/20">
              <UserMinus className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-black text-white mb-2">
              Remove Team Member
            </DialogTitle>

            <DialogDescription className="text-sm sm:text-base text-muted-foreground font-medium">
              Select a member to remove from{" "}
              <span className="text-white font-bold">{workspace.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 sm:mt-6 space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {workspace.members.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={cn(
                  "flex items-center justify-between p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all",
                  selectedMemberId === member.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]",
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                    {member.name.charAt(0)}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">
                      {member.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black opacity-60">
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

          <DialogFooter className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsRemoveMemberOpen(false);
                setSelectedMemberId(null);
              }}
              className="h-11 sm:h-12 w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              onClick={handleRemoveMember}
              disabled={isLoading || !selectedMemberId}
              className="h-11 sm:h-12 w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Remove Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
