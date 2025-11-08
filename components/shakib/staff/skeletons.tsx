"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function StaffListSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-md bg-muted/40">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="w-2/5 h-4 mb-2" />
                        <Skeleton className="w-1/3 h-3" />
                    </div>
                    <Skeleton className="w-24 h-8 rounded" />
                </div>
            ))}
        </div>
    );
}

export function StaffCardSkeleton() {
    return (
        <div className="p-4 rounded-md border bg-card animate-pulse">
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-20 h-3" />
                </div>
            </div>
        </div>
    );
}
