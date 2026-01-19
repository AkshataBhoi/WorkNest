export interface Member {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: 'Admin' | 'Member'; // Role within workspace
    joinedAt?: string; // ISO date string
}

export interface Invite {
    id: string; // The invite code
    workspaceId: string;
    createdBy: string; // Admin UID
    createdAt: any; // serverTimestamp or ISO
}

export interface Expense {
    id: string;
    title: string;
    amount: number;
    paidById: string; // ID of the member who paid
    splitBetween: string[]; // IDs of members the expense is split between
    status: "Paid" | "Pending" | "Cleared";
    date: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: "Pending" | "In Progress" | "Completed";
    assignedTo: string[]; // Array of member IDs
    dueDate: string; // ISO date string
    projectId?: string; // Optional project link
}

export interface Project {
    id: string;
    name: string;
    status: "In Progress" | "Completed";
    totalExpense: number;
    expenses: Expense[];
}
export type WorkspaceRole = "Admin" | "Member" | "viewer";

export interface Workspace {
    id: string;
    name: string;
    description: string;
    status: "In Progress" | "Completed" | "On Hold" | "Pending";
    role: WorkspaceRole;
    membersCount: number;
    lastActive: string;
    progress: number;
    members: Member[]; // Full objects for UI display
    memberIds: string[]; // For queries
    membersMap: { [uid: string]: "Admin" | "Member" }; // FOR RBAC
    inviteCode?: string;
    code?: string;
    projects: Project[];
    tasks: Task[];
    ownerId?: string; // Legacy field, keeping for compatibility
    createdBy: string; // The Admin UID
    createdAt?: any;
}

// export const MOCK_WORKSPACES: Workspace[] = [
//     {
//         id: "ws-1",
//         name: "Final Year Project",
//         description: "Collaboration space for the CS final year capstone project.",
//         status: "In Progress",
//         membersCount: 4,
//         lastActive: "2h ago",
//         progress: 65,
//         ownerId: "user-admin-1",
//         memberIds: ["m1", "m2", "m3", "m4", "user-admin-1"],
//         members: [
//             { id: "m1", name: "Alex Johnson", email: "alex@gmail.com", role: "Admin" },
//             { id: "m2", name: "Sarah Smith", email: "sarah.s@outlook.com", role: "Member" },
//             { id: "m3", name: "Mike Ross", email: "mike.ross@gmail.com", role: "Member" },
//             { id: "m4", name: "Rachel Zane", email: "rachel@worknest.dev", role: "Member" },
//         ],
//         projects: [
//             {
//                 id: "p1",
//                 name: "Frontend Development",
//                 status: "In Progress",
//                 totalExpense: 1250,
//                 expenses: [
//                     { id: "e1", title: "Hosting (Vercel)", amount: 500, paidById: "m1", splitBetween: ["m1", "m2", "m3", "m4"], status: "Paid", date: "2024-01-05" },
//                     { id: "e2", title: "UI Kit License", amount: 750, paidById: "m2", splitBetween: ["m1", "m2", "m3", "m4"], status: "Paid", date: "2024-01-06" }
//                 ]
//             },
//             {
//                 id: "p2",
//                 name: "Backend API",
//                 status: "In Progress",
//                 totalExpense: 0,
//                 expenses: []
//             }
//         ],
//         tasks: [
//             { id: "t1", title: "Setup Project Structure", description: "Initialize Next.js project and install dependencies", status: "Completed", assignedTo: ["m1"], dueDate: "2024-02-01" },
//             { id: "t2", title: "Design Landing Page", description: "Create wireframes and implement components for the hero section", status: "In Progress", assignedTo: ["m2", "m3"], dueDate: "2024-02-10", projectId: "p1" }
//         ]
//     },
//     {
//         id: "ws-2",
//         name: "Marketing Launch",
//         description: "Planning and design for the Q1 product launch.",
//         status: "Completed",
//         membersCount: 8,
//         lastActive: "1d ago",
//         progress: 100,
//         ownerId: "m5",
//         memberIds: ["m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"],
//         members: [
//             { id: "m5", name: "James Bond", email: "007@mi6.gov.uk", role: "Admin" },
//             { id: "m6", name: "Emma Watson", email: "emma@univ.edu", role: "Member" },
//             { id: "m7", name: "John Doe", email: "john@company.com", role: "Member" },
//             { id: "m8", name: "Jane Smith", email: "jane@gmail.com", role: "Member" },
//             { id: "m9", name: "David Miller", email: "david@marketing.io", role: "Member" },
//             { id: "m10", name: "Sophie Brown", email: "sophie@worknest.dev", role: "Member" },
//             { id: "m11", name: "Chris Evans", email: "chris@avengers.com", role: "Member" },
//             { id: "m12", name: "Tony Stark", email: "tony@stark.id", role: "Member" },
//         ],
//         projects: [
//             {
//                 id: "p3",
//                 name: "Social Media Campaign",
//                 status: "Completed",
//                 totalExpense: 5000,
//                 expenses: [
//                     { id: "e3", title: "Facebook Ads", amount: 3000, paidById: "m12", splitBetween: ["m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"], status: "Cleared", date: "2024-01-02" },
//                     { id: "e4", title: "Design Assets", amount: 2000, paidById: "m9", splitBetween: ["m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"], status: "Paid", date: "2024-01-03" }
//                 ]
//             }
//         ],
//         tasks: []
//     },
//     {
//         id: "ws-3",
//         name: "Research & Development",
//         description: "Exploring new UI patterns and performance optimizations.",
//         status: "In Progress",
//         membersCount: 3,
//         lastActive: "5h ago",
//         progress: 40,
//         ownerId: "user-admin-1",
//         memberIds: ["m13", "m14", "m15", "user-admin-1"],
//         members: [
//             { id: "m13", name: "Alan Turing", email: "alan@enigma.com", role: "Admin" },
//             { id: "m14", name: "Ada Lovelace", email: "ada@computing.org", role: "Member" },
//             { id: "m15", name: "Grace Hopper", email: "grace@cobol.dev", role: "Member" },
//         ],
//         projects: [],
//         tasks: []
//     }
// ];
