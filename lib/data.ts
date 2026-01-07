export interface Member {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface Expense {
    id: string;
    title: string;
    amount: number;
    paidById: string; // ID of the member who paid
    status: "Paid" | "Pending" | "Cleared";
    date: string;
}

export interface Project {
    id: string;
    name: string;
    status: "In Progress" | "Completed";
    totalExpense: number;
    expenses: Expense[];
}

export interface Workspace {
    id: string;
    name: string;
    description: string;
    role: "Owner" | "Member";
    status: "In Progress" | "Completed";
    membersCount: number;
    lastActive: string;
    progress: number;
    members: Member[];
    inviteCode?: string;
    projects: Project[];
}

export const MOCK_WORKSPACES: Workspace[] = [
    {
        id: "ws-1",
        name: "Final Year Project",
        description: "Collaboration space for the CS final year capstone project.",
        role: "Owner",
        status: "In Progress",
        membersCount: 4,
        lastActive: "2h ago",
        progress: 65,
        members: [
            { id: "m1", name: "Alex Johnson", email: "alex@gmail.com" },
            { id: "m2", name: "Sarah Smith", email: "sarah.s@outlook.com" },
            { id: "m3", name: "Mike Ross", email: "mike.ross@gmail.com" },
            { id: "m4", name: "Rachel Zane", email: "rachel@worknest.dev" },
        ],
        projects: [
            {
                id: "p1",
                name: "Frontend Development",
                status: "In Progress",
                totalExpense: 1250,
                expenses: [
                    { id: "e1", title: "Hosting (Vercel)", amount: 500, paidById: "m1", status: "Paid", date: "2024-01-05" },
                    { id: "e2", title: "UI Kit License", amount: 750, paidById: "m2", status: "Paid", date: "2024-01-06" }
                ]
            },
            {
                id: "p2",
                name: "Backend API",
                status: "In Progress",
                totalExpense: 0,
                expenses: []
            }
        ]
    },
    {
        id: "ws-2",
        name: "Marketing Launch",
        description: "Planning and design for the Q1 product launch.",
        role: "Member",
        status: "Completed",
        membersCount: 8,
        lastActive: "1d ago",
        progress: 100,
        members: [
            { id: "m5", name: "James Bond", email: "007@mi6.gov.uk" },
            { id: "m6", name: "Emma Watson", email: "emma@univ.edu" },
            { id: "m7", name: "John Doe", email: "john@company.com" },
            { id: "m8", name: "Jane Smith", email: "jane@gmail.com" },
            { id: "m9", name: "David Miller", email: "david@marketing.io" },
            { id: "m10", name: "Sophie Brown", email: "sophie@worknest.dev" },
            { id: "m11", name: "Chris Evans", email: "chris@avengers.com" },
            { id: "m12", name: "Tony Stark", email: "tony@stark.id" },
        ],
        projects: [
            {
                id: "p3",
                name: "Social Media Campaign",
                status: "Completed",
                totalExpense: 5000,
                expenses: [
                    { id: "e3", title: "Facebook Ads", amount: 3000, paidById: "m12", status: "Cleared", date: "2024-01-02" },
                    { id: "e4", title: "Design Assets", amount: 2000, paidById: "m9", status: "Paid", date: "2024-01-03" }
                ]
            }
        ]
    },
    {
        id: "ws-3",
        name: "Research & Development",
        description: "Exploring new UI patterns and performance optimizations.",
        role: "Owner",
        status: "In Progress",
        membersCount: 3,
        lastActive: "5h ago",
        progress: 40,
        members: [
            { id: "m13", name: "Alan Turing", email: "alan@enigma.com" },
            { id: "m14", name: "Ada Lovelace", email: "ada@computing.org" },
            { id: "m15", name: "Grace Hopper", email: "grace@cobol.dev" },
        ],
        projects: []
    }
];
