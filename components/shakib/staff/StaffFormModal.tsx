"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    StaffCard as StaffCardType,
    CreateStaffReq,
    UpdateStaffReq,
    CenterStaffRole,
} from "@/types/shakib/staff.types";
import { motion } from "framer-motion";
import { StaffFormErrors } from "@/types/shakib/staff.types";
import useStaffStore from "@/store/shakib/staff.store";

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    initial?: Partial<StaffCardType> | null;
}

export function StaffFormModal({ open, onOpenChange, initial }: Props) {
    const { createStaff, updateStaff } = useStaffStore();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<Partial<CreateStaffReq & UpdateStaffReq>>({
        fullName: initial?.fullName ?? "",
        email: initial?.email ?? "",
        phone: initial?.phone ?? "",
        role: initial?.role ?? CenterStaffRole.Other,
        isActive: initial?.isActive ?? true,
    });
    const [errors, setErrors] = useState<StaffFormErrors>({});

    useEffect(() => {
        setForm((f) => ({
            ...f,
            fullName: initial?.fullName ?? f.fullName,
            email: initial?.email ?? f.email,
            phone: initial?.phone ?? f.phone,
            role: initial?.role ?? f.role,
            isActive: initial?.isActive ?? f.isActive,
        }));
    }, [initial]);

    function validate(): boolean {
        const e: StaffFormErrors = {};
        if (!form.fullName || String(form.fullName).trim().length < 2)
            e.fullName = "Provide a valid full name";
        if (form.email && !String(form.email).includes("@"))
            e.email = "Enter a valid email";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            if (initial?.id) {
                await updateStaff({ ...(form as UpdateStaffReq), id: initial.id });
            } else {
                await createStaff(form as CreateStaffReq);
            }
            onOpenChange(false);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[520px] p-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full p-6"
                >
                    <form onSubmit={onSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>
                                {initial?.id ? "Edit staff" : "Add staff"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label>Full name</Label>
                                <Input
                                    value={form.fullName ?? ""}
                                    onChange={(e) =>
                                        setForm({ ...form, fullName: e.target.value })
                                    }
                                />
                                {errors.fullName && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    value={form.email ?? ""}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={form.phone ?? ""}
                                    onChange={(e) =>
                                        setForm({ ...form, phone: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Role</Label>
                                <Select
                                    onValueChange={(v) => setForm({ ...form, role: v })}
                                    defaultValue={String(form.role)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={CenterStaffRole.Admin}>Admin</SelectItem>
                                        <SelectItem value={CenterStaffRole.Nurse}>Nurse</SelectItem>
                                        <SelectItem value={CenterStaffRole.Pharmacist}>
                                            Pharmacist
                                        </SelectItem>
                                        <SelectItem value={CenterStaffRole.Reception}>
                                            Reception
                                        </SelectItem>
                                        <SelectItem value={CenterStaffRole.Manager}>Manager</SelectItem>
                                        <SelectItem value={CenterStaffRole.Other}>Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-3">
                                <Label className="mb-0">Active</Label>
                                <Switch
                                    checked={form.isActive ?? true}
                                    onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
