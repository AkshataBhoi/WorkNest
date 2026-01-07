"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function WorkspaceExpensesRedirect() {
    const params = useParams();
    const router = useRouter();
    const { getWorkspaceById } = useWorkspaces();

    const workspace = getWorkspaceById(params.id as string);

    useEffect(() => {
        if (workspace) {
            if (workspace.projects.length > 0) {
                // Redirect to the first project's expenses by default
                router.replace(`/workspace/${workspace.id}/projects/${workspace.projects[0].id}/expenses`);
            } else {
                // If no projects, stay on workspace page or show error
                router.replace(`/workspace/${workspace.id}`);
            }
        }
    }, [workspace, router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Navigating to expenses...</h1>
            {!workspace && (
                <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            )}
        </div>
    );
}
