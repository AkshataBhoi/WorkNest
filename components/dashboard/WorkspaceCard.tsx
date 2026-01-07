"use client";

import Link from "next/link";
import { LinkIcon, ArrowRight, User, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
    id: string;
    name: string;
    description: string;
    role: "Owner" | "Member";
    status: "In Progress" | "Completed";
    membersCount: number;
}

export function WorkspaceCard({ id, name, description, role, status, membersCount }: WorkspaceCardProps) {
    return (
        <Card className="flex flex-col h-full border-border/60 bg-card/50 hover:bg-card/80 transition-all duration-300">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl line-clamp-1">{name}</CardTitle>
                    <Badge variant={status === "Completed" ? "success" : "warning"}>
                        {status}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span className={cn(role === "Owner" ? "text-primary font-medium" : "")}>
                            {role}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{membersCount} members</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                <Link href={`/workspace/${id}`} className="w-full">
                    <Button variant="outline" className="w-full justify-between group hover:border-primary/50 hover:bg-primary/5">
                        Open Workspace
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
