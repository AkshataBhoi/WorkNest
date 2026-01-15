"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Workspace, Member, Expense, Project, Task } from "@/lib/data";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase.client";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

interface WorkspaceContextType {
  workspaces: Workspace[];
  myWorkspaces: Workspace[];
  sharedWorkspaces: Workspace[];
  createWorkspace: (name: string, description: string) => Promise<string>;
  joinWorkspace: (inviteCode: string) => Promise<boolean>;
  getWorkspaceById: (id: string) => Workspace | undefined;
  addExpense: (
    workspaceId: string,
    projectId: string,
    expense: Omit<Expense, "id" | "date">
  ) => Promise<void>;
  updateExpenseStatus: (
    workspaceId: string,
    projectId: string,
    expenseId: string,
    status: Expense["status"]
  ) => Promise<void>;
  updateProjectStatus: (
    workspaceId: string,
    projectId: string,
    status: Project["status"]
  ) => Promise<boolean>;
  updateWorkspaceStatus: (
    workspaceId: string,
    status: Workspace["status"]
  ) => Promise<boolean>;
  assignTask: (workspaceId: string, task: Omit<Task, "id">) => Promise<void>;
  updateTaskStatus: (
    workspaceId: string,
    taskId: string,
    status: Task["status"]
  ) => Promise<void>;
  createProject: (workspaceId: string, name: string) => Promise<void>;
  getUserRole: (workspaceId: string) => "Admin" | "Member" | null;
  validateInviteCode: (inviteCode: string) => Promise<string | null>;
  joinWorkspaceWithEmail: (
    workspaceId: string,
    email: string,
    name: string
  ) => Promise<boolean>;
  isInitialized: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingJoin, setPendingJoin] = useState(false);

  /**
   * WORKSPACE SYNC LOGIC
   * Strictly gated by Auth readiness to prevent "offline" initialization errors.
   */
  useEffect(() => {
    // Essential Guard: NEVER fire listeners until Auth has settled
    if (isAuthLoading) return;

    // If no user, reset and stop
    if (!currentUser?.id) {
      setWorkspaces([]);
      setIsInitialized(true);
      return;
    }

    // Singleton Guard
    if (!db) {
      console.error("Firestore instance missing during workspace sync.");
      setIsInitialized(true);
      return;
    }

    // For non-auth persistence, check localStorage for a selected email
    const storedEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("worknest_current_email")
        : null;

    const q = currentUser?.id
      ? query(
        collection(db, "workspaces"),
        where("memberIds", "array-contains", currentUser.id)
      )
      : storedEmail
        ? query(
          collection(db, "workspaces"),
          where("memberEmails", "array-contains", storedEmail)
        )
        : null;

    if (!q) {
      setWorkspaces([]);
      setIsInitialized(true);
      return;
    }

    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        const fetchedWorkspaces = snapshot.docs.map((doc) => {
          const data = doc.data();

          let role: "admin" | "member" | "viewer" = "viewer";

          if (currentUser?.id) {
            if (data.ownerId === currentUser.id) {
              role = "admin";
            } else if (Array.isArray(data.members)) {
              const member = data.members.find(
                (m: any) => m.id === currentUser.id
              );
              role = (member?.role?.toLowerCase() ?? "member") as
                | "admin"
                | "member"
                | "viewer";
            }
          } else if (storedEmail && Array.isArray(data.members)) {
            const member = data.members.find(
              (m: any) => m.email === storedEmail
            );
            role = (member?.role?.toLowerCase() ?? "member") as
              | "admin"
              | "member"
              | "viewer";
          }

          return {
            id: doc.id,
            ...data,
            code: data.inviteCode || data.code,
            role, // ✅ FIX
          } as Workspace;
        });

        // Use a functional update to ensure we're and-ing with the previous state if needed
        // but here we just want the latest fetched workspaces.
        setWorkspaces(fetchedWorkspaces);
        setIsInitialized(true);
      },
      error: (error: any) => {
        // Ignore transient "offline" log noise in dev, but set initialized to prevent infinite loading
        if (error.code !== "unavailable") {
          console.error("Workspace listener error:", error);
        }
        setIsInitialized(true);
      },
    });

    return () => unsubscribe();
  }, [currentUser?.id, isAuthLoading]);

  // Computed views
  const myWorkspaces = useMemo(
    () => workspaces.filter((ws) => ws.ownerId === currentUser?.id),
    [workspaces, currentUser?.id]
  );

  const sharedWorkspaces = useMemo(
    () => workspaces.filter((ws) => ws.ownerId !== currentUser?.id),
    [workspaces, currentUser?.id]
  );

  const generateInviteCode = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `WN-${randomNum}`;
  };

  const createWorkspace = async (name: string, description: string) => {
    if (!currentUser?.id || !db) throw new Error("Connection or Auth missing.");

    const inviteCode = generateInviteCode();
    const ownerMember: Member = {
      id: currentUser.id,
      name: currentUser.name || "User",
      email: currentUser.email || "",
      role: "Admin",
      avatarUrl: "",
    };

    const newWorkspaceData = {
      name: name || "Untitled Workspace",
      description: description || "",
      status: "In Progress",
      membersCount: 1,
      lastActive: new Date().toISOString(),
      progress: 0,
      inviteCode,
      code: inviteCode,
      ownerId: currentUser.id,
      members: [ownerMember],
      memberIds: [currentUser.id],
      projects: [],
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    // Use doc() to generate a reference with an ID locally.
    // This allows returning the ID IMMEDIATELY without waiting for Firestore server roundtrip.
    const docRef = doc(collection(db, "workspaces"));
    const workspaceId = docRef.id;

    // Fire and forget the write - Firestore persistence will sync it eventually,
    // and correctly handle the local cache update in the meantime.
    setDoc(docRef, newWorkspaceData).catch((err: any) => {
      console.error("Delayed workspace creation failed:", err);
    });

    return workspaceId;
  };

  const joinWorkspace = async (inviteCode: string): Promise<boolean> => {
    if (!currentUser?.id || !db) return false;

    try {
      const q = query(
        collection(db, "workspaces"),
        where("inviteCode", "==", inviteCode)
      );

      const querySnapshot = await getDocs(q);

      let workspaceId: string | null = null;

      if (!querySnapshot.empty) {
        workspaceId = querySnapshot.docs[0].id;
      } else {
        const q2 = query(
          collection(db, "workspaces"),
          where("code", "==", inviteCode)
        );

        const snap2 = await getDocs(q2);
        if (snap2.empty) return false;

        workspaceId = snap2.docs[0].id;
      }

      const joined = await applyJoin(workspaceId);

      if (joined) {
        setPendingJoin(true); // ✅ VERY IMPORTANT
      }

      return joined;
    } catch (error) {
      console.error("joinWorkspace failed:", error);
      return false;
    }
  };

  const validateInviteCode = async (
    inviteCode: string
  ): Promise<string | null> => {
    if (!db) return null;
    try {
      // First attempt: try getting from both fields
      const q1 = query(
        collection(db, "workspaces"),
        where("inviteCode", "==", inviteCode)
      );
      const snap1 = await getDocs(q1);
      if (!snap1.empty) return snap1.docs[0].id;

      const q2 = query(
        collection(db, "workspaces"),
        where("code", "==", inviteCode)
      );
      const snap2 = await getDocs(q2);
      if (!snap2.empty) return snap2.docs[0].id;

      return null;
    } catch (err: any) {
      console.error("validateInviteCode failed:", err);
      return null;
    }
  };

  const joinWorkspaceWithEmail = async (
    workspaceId: string,
    email: string,
    name: string
  ): Promise<boolean> => {
    if (!db) return false;
    try {
      const workspaceRef = doc(db, "workspaces", workspaceId);
      const wsSnap = await getDoc(workspaceRef);
      if (!wsSnap.exists()) return false;

      const wsData = wsSnap.data() as Workspace;
      const memberEmails = wsData.memberEmails || [];

      if (memberEmails.includes(email)) {
        // Already a member, just update local storage for identity
        localStorage.setItem("worknest_current_email", email);
        return true;
      }

      const newMember: Member = {
        id: `m-${Date.now()}`,
        name: name,
        email: email,
        role: "Member",
        avatarUrl: "",
      } as any;

      const updatedMembers = [
        ...(wsData.members || []),
        { ...newMember, joinedAt: new Date().toISOString() },
      ];

      await updateDoc(workspaceRef, {
        members: updatedMembers,
        memberEmails: [...memberEmails, email],
        memberIds: [...(wsData.memberIds || []), newMember.id],
        membersCount: updatedMembers.length,
      });

      localStorage.setItem("worknest_current_email", email);
      return true;
    } catch (err: any) {
      console.error("joinWorkspaceWithEmail failed:", err);
      return false;
    }
  };

  const applyJoin = async (workspaceId: string) => {
    if (!currentUser?.id || !db) return false;
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const workspaceSnapshot = await getDoc(workspaceRef);
    if (!workspaceSnapshot.exists()) return false;
    const workspaceData = workspaceSnapshot.data() as Workspace;

    if (workspaceData.memberIds?.includes(currentUser.id)) return true;

    const newMember: Member = {
      id: currentUser.id,
      name: currentUser.name || "Member",
      email: currentUser.email || "",
      role: "Member",
      avatarUrl: "",
    };

    const updatedMembers = [...(workspaceData.members || []), newMember];
    const updatedMemberIds = [
      ...(workspaceData.memberIds || []),
      currentUser.id,
    ];

    await updateDoc(workspaceRef, {
      members: updatedMembers,
      memberIds: updatedMemberIds,
      membersCount: updatedMembers.length,
    });

    return true;
  };

  const getWorkspaceById = (id: string) =>
    workspaces.find((ws) => ws.id === id);

  const getUserRole = (workspaceId: string): "Admin" | "Member" | null => {
    if (!currentUser?.id) return null;

    const workspace = workspaces.find((ws) => ws.id === workspaceId);
    if (!workspace) return null;

    // Owner is always Admin
    if (workspace.ownerId === currentUser.id) {
      return "Admin";
    }

    const member = workspace.members.find((m) =>
      currentUser?.id
        ? m.id === currentUser.id
        : m.email === localStorage.getItem("worknest_current_email")
    );

    if (!member) return null;

    // Normalize role
    return member.role === "Admin" ? "Admin" : "Member";
  };

  const createProject = async (workspaceId: string, name: string) => {
    if (!db) return;
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const wsSnap = await getDoc(workspaceRef);
    if (wsSnap.exists()) {
      const wsData = wsSnap.data() as Workspace;
      const newProject: Project = {
        id: `p-${Date.now()}`,
        name: name || "Untitled Project",
        status: "In Progress",
        totalExpense: 0,
        expenses: [],
      };
      await updateDoc(workspaceRef, {
        projects: [...(wsData.projects || []), newProject],
      });
    }
  };

  const assignTask = async (workspaceId: string, task: Omit<Task, "id">) => {
    if (!db || getUserRole(workspaceId) !== "Admin") return;
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const wsSnap = await getDoc(workspaceRef);
    if (wsSnap.exists()) {
      const wsData = wsSnap.data() as Workspace;
      const newTask: Task = {
        ...task,
        id: `t-${Date.now()}`,
        assignedTo: task.assignedTo || [],
        projectId: task.projectId || "",
        description: task.description || "",
        status: task.status || "Pending",
      };
      await updateDoc(workspaceRef, {
        tasks: [...(wsData.tasks || []), newTask],
      });
    }
  };

  const addExpense = async (
    workspaceId: string,
    projectId: string,
    expense: Omit<Expense, "id" | "date">
  ) => {
    if (!db) return;
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const wsSnap = await getDoc(workspaceRef);
    if (wsSnap.exists()) {
      const wsData = wsSnap.data() as Workspace;
      const updatedProjects = (wsData.projects || []).map((p) => {
        if (p.id === projectId) {
          const newExpense: Expense = {
            ...expense,
            id: `e-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            splitBetween: expense.splitBetween || [],
          };
          return {
            ...p,
            expenses: [...(p.expenses || []), newExpense],
            totalExpense: (p.totalExpense || 0) + expense.amount,
          };
        }
        return p;
      });
      await updateDoc(workspaceRef, { projects: updatedProjects });
    }
  };

  const updateExpenseStatus = async (
    workspaceId: string,
    projectId: string,
    expenseId: string,
    status: Expense["status"]
  ) => {
    if (!db) return;
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const wsSnap = await getDoc(workspaceRef);
    if (wsSnap.exists()) {
      const wsData = wsSnap.data() as Workspace;
      const updatedProjects = (wsData.projects || []).map((p) => {
        if (p.id === projectId)
          return {
            ...p,
            expenses: (p.expenses || []).map((e) =>
              e.id === expenseId ? { ...e, status } : e
            ),
          };
        return p;
      });
      await updateDoc(workspaceRef, { projects: updatedProjects });
    }
  };

  const updateProjectStatus = async (
    workspaceId: string,
    projectId: string,
    status: Project["status"]
  ) => {
    if (!db || getUserRole(workspaceId) !== "Admin") return false;
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const wsSnap = await getDoc(workspaceRef);
    if (wsSnap.exists()) {
      const wsData = wsSnap.data() as Workspace;
      const updatedProjects = (wsData.projects || []).map((p) =>
        p.id === projectId ? { ...p, status } : p
      );
      await updateDoc(workspaceRef, { projects: updatedProjects });
      return true;
    }
    return false;
  };

  // const updateWorkspaceStatus = async (
  //   workspaceId: string,
  //   status: Workspace["status"]
  // ) => {
  //   if (!db || getUserRole(workspaceId) !== "Admin") return false;
  //   await updateDoc(doc(db, "workspaces", workspaceId), { status });
  //   return true;
  // };
  const updateWorkspaceStatus = async (
    workspaceId: string,
    status: "Pending" | "In Progress" | "Completed" | "On Hold"
  ): Promise<boolean> => {
    if (!db) return false;

    try {
      const ref = doc(db, "workspaces", workspaceId);

      await updateDoc(ref, {
        status,
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (err) {
      console.error("Failed to update status", err);
      return false;
    }
  };

  const updateTaskStatus = async (
    workspaceId: string,
    taskId: string,
    status: Task["status"]
  ) => {
    if (!db) return;
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const wsSnap = await getDoc(workspaceRef);
    if (wsSnap.exists()) {
      const wsData = wsSnap.data() as Workspace;
      const updatedTasks = (wsData.tasks || []).map((t) =>
        t.id === taskId ? { ...t, status } : t
      );
      await updateDoc(workspaceRef, { tasks: updatedTasks });
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        myWorkspaces,
        sharedWorkspaces,
        createWorkspace,
        joinWorkspace,
        getWorkspaceById,
        addExpense,
        updateExpenseStatus,
        updateProjectStatus,
        updateWorkspaceStatus,
        assignTask,
        updateTaskStatus,
        createProject,
        getUserRole,
        validateInviteCode,
        joinWorkspaceWithEmail,
        isInitialized,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaces = () => {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error("useWorkspaces must be used within a WorkspaceProvider");
  return context;
};
