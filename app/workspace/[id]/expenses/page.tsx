"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/components/context/WorkspaceContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X, Users } from "lucide-react";

export default function WorkspaceExpensesRedirect() {
    const params = useParams();
    const router = useRouter();
    const { getWorkspaceById, isInitialized, resetToMocks } = useWorkspaces();

    const workspace = getWorkspaceById(params.id as string);

    useEffect(() => {
        if (workspace && isInitialized) {
            if (workspace.projects.length > 0) {
                // Redirect to the first project's expenses after a short delay
                const timeout = setTimeout(() => {
                    router.replace(`/workspace/${workspace.id}/projects/${workspace.projects[0].id}/expenses`);
                }, 800);
                return () => clearTimeout(timeout);
            }
        }
    }, [workspace, router, isInitialized]);

    if (!isInitialized) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {!workspace ? (
                <div className="text-center group">
                    <div className="h-20 w-20 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <X className="h-10 w-10 text-rose-500" />
                    </div>
                    <h1 className="text-2xl font-black mb-2">Workspace Not Found</h1>
                    <p className="text-muted-foreground mb-8 max-w-xs mx-auto">The workspace you're looking for doesn't exist or you don't have access.</p>
                    <Link href="/dashboard">
                        <Button className="h-12 px-8 rounded-2xl font-bold">Return to Dashboard</Button>
                    </Link>
                </div>
            ) : workspace.projects.length === 0 ? (
                <div className="text-center group">
                    <div className="h-20 w-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Users className="h-10 w-10 text-indigo-500" />
                    </div>
                    <h1 className="text-2xl font-black mb-2">No Projects Found</h1>
                    <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Create a project in <b>{workspace.name}</b> to start tracking expenses.</p>
                    <div className="flex flex-col gap-3">
                        <Link href={`/workspace/${workspace.id}`}>
                            <Button className="h-12 px-8 rounded-2xl font-bold w-full">Go to Workspace</Button>
                        </Link>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                resetToMocks();
                                router.push("/dashboard");
                            }}
                            className="h-12 px-8 rounded-2xl font-bold w-full border border-white/10"
                        >
                            Restore Demo Data
                        </Button>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="h-12 px-8 rounded-2xl font-bold w-full opacity-60 hover:opacity-100">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="relative h-20 w-20 mb-8 mx-auto">
                        <div className="absolute inset-0 rounded-[2rem] bg-primary/20 animate-ping" />
                        <div className="relative h-full w-full rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black mb-2 tracking-tight">Accessing Expenses</h1>
                    <p className="text-muted-foreground animate-pulse">Redirecting you to {workspace.projects[0].name}...</p>
                </div>
            )}
        </div>
    );
}
