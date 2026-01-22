// Core type definitions for WorkNest authentication and user management

export type UserRole = 'Admin' | 'Member';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional for Firebase Auth users
    role: UserRole;
    avatarUrl?: string;
    createdAt: string;
}

export interface AuthSession {
    userId: string;
    email: string;
    loginTime: string;
}

export interface WorkspaceMembership {
    workspaceId: string;
    userId: string;
    role: UserRole;
    joinedAt: string;
}

export interface GmailAccount {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    type: 'personal' | 'work';
}

// Mock Gmail accounts for testing
export const MOCK_GMAIL_ACCOUNTS: GmailAccount[] = [
    {
        id: 'gmail-1',
        name: 'Akshata Bhoi',
        email: 'akshata.bhoi@gmail.com',
        type: 'personal'
    },
    {
        id: 'gmail-2',
        name: 'Akshata Bhoi',
        email: 'akshata@worknest.dev',
        type: 'work'
    },
    {
        id: 'gmail-3',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        type: 'personal'
    },
    {
        id: 'gmail-4',
        name: 'Sarah Smith',
        email: 'sarah.smith@company.com',
        type: 'work'
    },
    {
        id: 'gmail-5',
        name: 'Mike Ross',
        email: 'mike.ross@gmail.com',
        type: 'personal'
    }
];
