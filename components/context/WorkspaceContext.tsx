"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_WORKSPACES, Workspace, Member, Expense, Project } from "@/lib/data";

interface WorkspaceContextType {
    workspaces: Workspace[];
    createWorkspace: (name: string, description: string) => string;
    joinWorkspace: (inviteCode: string, email: string) => boolean;
    getWorkspaceById: (id: string) => Workspace | undefined;
    addExpense: (workspaceId: string, projectId: string, expense: Omit<Expense, "id" | "date">) => void;
    updateExpenseStatus: (workspaceId: string, projectId: string, expenseId: string, status: Expense["status"]) => void;
    updateProjectStatus: (workspaceId: string, projectId: string, status: Project["status"]) => boolean;
    currentUser: Member;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const CURRENT_USER: Member = {
    id: "user-1",
    name: "Akshata Bhoi",
    email: "akshata@worknest.dev",
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage or MOCK_WORKSPACES
    useEffect(() => {
        const saved = localStorage.getItem("worknest_workspaces");
        if (saved) {
            try {
                const parsedWorkspaces = JSON.parse(saved);
                // Simple migration: Ensure projects array exists for existing workspaces
                const migratedWorkspaces = parsedWorkspaces.map((ws: Workspace) => ({
                    ...ws,
                    projects: ws.projects || []
                }));
                setWorkspaces(migratedWorkspaces);
            } catch (e) {
                console.error("Failed to parse saved workspaces", e);
                setWorkspaces(MOCK_WORKSPACES);
            }
        } else {
            setWorkspaces(MOCK_WORKSPACES);
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever workspaces change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("worknest_workspaces", JSON.stringify(workspaces));
        }
    }, [workspaces, isInitialized]);

    const generateInviteCode = () => {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `WN-${randomNum}`;
    };

    const createWorkspace = (name: string, description: string) => {
        const newId = `ws-${Date.now()}`;
        const newWorkspace: Workspace = {
            id: newId,
            name,
            description,
            role: "Owner",
            status: "In Progress",
            membersCount: 1,
            lastActive: "Just now",
            progress: 0,
            inviteCode: generateInviteCode(),
            members: [CURRENT_USER],
            projects: []
        };

        setWorkspaces((prev) => [newWorkspace, ...prev]);
        return newId;
    };

    const addExpense = (workspaceId: string, projectId: string, expense: Omit<Expense, "id" | "date">) => {
        setWorkspaces(prev => prev.map(ws => {
            if (ws.id === workspaceId) {
                return {
                    ...ws,
                    projects: ws.projects.map(p => {
                        if (p.id === projectId) {
                            const newExpense: Expense = {
                                ...expense,
                                id: `e-${Date.now()}`,
                                date: new Date().toISOString().split('T')[0]
                            };
                            return {
                                ...p,
                                expenses: [...p.expenses, newExpense],
                                totalExpense: p.totalExpense + expense.amount
                            };
                        }
                        return p;
                    })
                };
            }
            return ws;
        }));
    };

    const updateExpenseStatus = (workspaceId: string, projectId: string, expenseId: string, status: Expense["status"]) => {
        setWorkspaces(prev => prev.map(ws => {
            if (ws.id === workspaceId) {
                return {
                    ...ws,
                    projects: ws.projects.map(p => {
                        if (p.id === projectId) {
                            return {
                                ...p,
                                expenses: p.expenses.map(e => e.id === expenseId ? { ...e, status } : e)
                            };
                        }
                        return p;
                    })
                };
            }
            return ws;
        }));
    };

    const updateProjectStatus = (workspaceId: string, projectId: string, status: Project["status"]) => {
        const workspace = workspaces.find(ws => ws.id === workspaceId);
        if (!workspace || workspace.role !== "Owner") return false;

        setWorkspaces(prev => prev.map(ws => {
            if (ws.id === workspaceId) {
                return {
                    ...ws,
                    projects: ws.projects.map(p => p.id === projectId ? { ...p, status } : p)
                };
            }
            return ws;
        }));
        return true;
    };

    const joinWorkspace = (inviteCode: string, email: string) => {
        if (inviteCode.startsWith("WN-")) {
            const member: Member = {
                id: `user-${Date.now()}`,
                name: email.split('@')[0],
                email: email
            };

            const existing = workspaces.find(ws => (ws as any).inviteCode === inviteCode);

            if (existing) {
                if (existing.members.find(m => m.email === email)) {
                    return true;
                }

                const updatedWorkspaces = workspaces.map(ws => {
                    if (ws.id === existing.id) {
                        return {
                            ...ws,
                            members: [...ws.members, member],
                            membersCount: ws.membersCount + 1,
                            role: "Member" as const
                        };
                    }
                    return ws;
                });
                setWorkspaces(updatedWorkspaces);
                return true;
            } else {
                const newWS: Workspace = {
                    id: `ws-joined-${Date.now()}`,
                    name: "Joined Workspace",
                    description: "You just joined this workspace using an invite code.",
                    role: "Member",
                    status: "In Progress",
                    membersCount: 5,
                    lastActive: "Just now",
                    progress: 10,
                    members: [...MOCK_WORKSPACES[0].members, member],
                    projects: []
                };
                setWorkspaces((prev) => [newWS, ...prev]);
                return true;
            }
        }
        return false;
    };

    const getWorkspaceById = (id: string) => {
        return workspaces.find(ws => ws.id === id);
    };

    return (
        <WorkspaceContext.Provider value={{
            workspaces,
            createWorkspace,
            joinWorkspace,
            getWorkspaceById,
            addExpense,
            updateExpenseStatus,
            updateProjectStatus,
            currentUser: CURRENT_USER
        }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspaces = () => {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error("useWorkspaces must be used within a WorkspaceProvider");
    }
    return context;
};
