"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { currentUser, isLoading: isAuthLoading } = useAuth();
    const { workspaces, isInitialized: isWsInitialized } = useWorkspaces();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isAuthLoading || !isWsInitialized) return;

        // 1. Auth Check: Redirect to login if not authenticated
        if (!currentUser) {
            router.replace("/login");
            return;
        }

        // 2. Workspace Membership Check
        // Patterns: /workspace/[id]
        const workspaceMatch = pathname.match(/\/workspace\/([^\/]+)/);
        if (workspaceMatch) {
            const workspaceId = workspaceMatch[1];

            // Special case: /workspace/join or /workspace/create
            if (workspaceId === "join" || workspaceId === "create") {
                setIsAuthorized(true);
                return;
            }

            const isMember = workspaces.some((ws) => ws.id === workspaceId);
            if (!isMember) {
                // Logged in but not a member of this specific workspace
                router.replace("/dashboard");
                return;
            }
        }

        setIsAuthorized(true);
    }, [currentUser, isAuthLoading, isWsInitialized, pathname, router, workspaces]);

    if (isAuthLoading || !isWsInitialized || (!isAuthorized && currentUser)) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm font-medium text-slate-400 animate-pulse">
                        Verifying access...
                    </p>
                </div>
            </div>
        );
    }

    // If not authenticated, the useEffect will handle the redirect, 
    // but we return null here to avoid rendering protected content.
    if (!currentUser) return null;

    return <>{children}</>;
}
