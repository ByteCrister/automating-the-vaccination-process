"use client";

import React from "react";
import { MoreHorizontal, Trash2, Edit2, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { StaffListItemSummary } from "@/types/shakib/staff.types";

interface Props {
    item: StaffListItemSummary;
    onEdit: (id: string) => void;
    onDelete: (id: string) => Promise<void> | void;
    onToggleActive: (id: string, active: boolean) => Promise<void> | void;
}

export function StaffRow({ item, onEdit, onDelete, onToggleActive }: Props) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50">
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.displayName}</span>
                        <span className="text-xs text-muted-foreground">{item.role}</span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{item.email ?? item.phone}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Joined {new Date(item.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(item.id)}>
                    <Edit2 className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onToggleActive(item.id, !item.isActive)}>
                            <ToggleRight className="w-4 h-4 mr-2" /> {item.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onDelete(item.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
