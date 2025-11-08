"use client";

import React from "react";
import { motion } from "framer-motion";
import { User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ID } from "@/types/shakib/staff.types";
import { StaffCard as StaffCardType } from "@/types/shakib/staff.types";

interface Props {
    staff: StaffCardType;
    onEdit?: (id: ID) => void;
    onAssign?: (staffId: ID) => void;
}

export function StaffCard({ staff, onEdit, onAssign }: Props) {
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg border bg-card"
        >
            <div className="flex items-center gap-3">
                {staff.avatarUrl ? (
                    <img src={staff.avatarUrl} alt={`${staff.displayName} avatar`} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-medium truncate">{staff.displayName}</h4>
                        <span className="text-xs text-muted-foreground">{staff.role}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{staff.phone ?? staff.email ?? "No contact"}</p>
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onAssign?.(staff.id)}>
                    Assign
                </Button>
                <Button size="sm" onClick={() => onEdit?.(staff.id)}>
                    Edit
                </Button>
            </div>
        </motion.article>
    );
}
