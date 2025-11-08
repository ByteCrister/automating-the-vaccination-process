"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiUser, FiCalendar, FiCheck, FiX, FiClock, FiArrowRight, FiUsers } from "react-icons/fi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    staffId: string | null;
    candidateSlots: { id: string; label: string }[];
}

export function AssignStaffModal({ open, onOpenChange, staffId, candidateSlots }: Props) {
    const [slotId, setSlotId] = useState<string | null>(candidateSlots?.[0]?.id ?? null);
    const [loading, setLoading] = useState(false);

    async function onAssign() {
        if (!staffId || !slotId) return;
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    }

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: { duration: 0.2 },
        },
    };

    const headerVariants: variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 0.1, duration: 0.4 },
        },
    };

    const contentVariants: variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.4 },
        },
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <DialogContent className="sm:max-w-[520px] p-0 gap-0 border-none shadow-2xl overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Animated Background Orbs */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <motion.div
                                    className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-3xl"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 90, 0],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-green-400/20 to-emerald-500/20 rounded-full blur-3xl"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        rotate: [0, -90, 0],
                                    }}
                                    transition={{
                                        duration: 10,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </div>

                            {/* Header Section */}
                            <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 px-6 py-8">
                                {/* Glossy overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5" />

                                {/* Grid pattern overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                                        backgroundSize: '20px 20px'
                                    }} />
                                </div>

                                <motion.div variants={headerVariants} className="relative">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30"
                                                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <FiUsers className="w-7 h-7 text-white drop-shadow-lg" />
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                                                    <FiCheck className="w-3 h-3 text-emerald-900" />
                                                </div>
                                            </motion.div>

                                            <div>
                                                <DialogTitle className="text-2xl font-bold text-white mb-1 tracking-tight">
                                                    Assign Staff Member
                                                </DialogTitle>
                                                <DialogDescription className="text-emerald-50/90 text-sm font-medium">
                                                    Select an available time slot to assign
                                                </DialogDescription>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onOpenChange(false)}
                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
                                        >
                                            <FiX className="w-4 h-4 text-white" />
                                        </motion.button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors">
                                            <FiClock className="w-3 h-3 mr-1" />
                                            {candidateSlots.length} Available
                                        </Badge>
                                        <Badge className="bg-green-400/30 text-white border-green-300/30 backdrop-blur-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-300 mr-1.5 animate-pulse" />
                                            Active
                                        </Badge>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content Section */}
                            <motion.div
                                variants={contentVariants}
                                className="relative px-6 py-6 space-y-6"
                            >
                                {/* Info Card */}
                                <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-green-50/50 shadow-sm">
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            <motion.div
                                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <FiCalendar className="w-6 h-6 text-white" />
                                            </motion.div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                                                    Available Time Slots
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
                                                        {candidateSlots.length}
                                                    </span>
                                                </h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Choose from the available time slots below to assign this staff member
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Select Section */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <motion.span
                                            className="w-2 h-2 rounded-full bg-emerald-500"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        Select Time Slot
                                    </label>

                                    <Select onValueChange={(v) => setSlotId(v)} defaultValue={slotId ?? undefined}>
                                        <SelectTrigger className="h-14 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200 text-base">
                                            <SelectValue placeholder="Choose a time slot" />
                                        </SelectTrigger>
                                        <SelectContent className="border-emerald-200">
                                            {candidateSlots.map((s, index) => (
                                                <motion.div
                                                    key={s.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <SelectItem
                                                        value={s.id}
                                                        className="hover:bg-emerald-50 focus:bg-emerald-50 cursor-pointer h-12 my-1"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                                                                <FiCalendar className="w-4 h-4 text-white" />
                                                            </div>
                                                            <span className="font-medium">{s.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                </motion.div>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {slotId && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="flex items-center gap-2 text-sm text-emerald-600 font-medium"
                                        >
                                            <FiCheck className="w-4 h-4" />
                                            <span>Slot selected</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Footer Section */}
                            <div className="relative px-6 py-5 bg-gradient-to-br from-gray-50 to-emerald-50/30 border-t border-emerald-100/50">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1"
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => onOpenChange(false)}
                                            disabled={loading}
                                            className="w-full h-12 text-gray-700 bg-white hover:bg-gray-50 font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
                                        >
                                            <FiX className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1"
                                    >
                                        <Button
                                            onClick={onAssign}
                                            disabled={loading || !slotId}
                                            className="w-full h-12 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-green-700 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        >
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                        />
                                                        <span>Assigning...</span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="assign"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <FiCheck className="w-5 h-5" />
                                                        <span>Assign Staff</span>
                                                        <motion.div
                                                            animate={{ x: [0, 4, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        >
                                                            <FiArrowRight className="w-4 h-4" />
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Glossy Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none" />

                                            {/* Animated Shine Effect */}
                                            <motion.div
                                                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"
                                                initial={false}
                                            />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>
    );
}

// Demo Component
export default function Demo() {
    const [open, setOpen] = useState(true);

    const candidateSlots = [
        { id: "1", label: "Monday 9:00 AM - 11:00 AM" },
        { id: "2", label: "Tuesday 2:00 PM - 4:00 PM" },
        { id: "3", label: "Wednesday 10:00 AM - 12:00 PM" },
        { id: "4", label: "Thursday 3:00 PM - 5:00 PM" },
        { id: "5", label: "Friday 1:00 PM - 3:00 PM" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-green-700 text-white font-bold px-8 py-6 text-lg shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 group"
                >
                    <FiUsers className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Open Assign Staff Modal
                </Button>
            </motion.div>

            <AssignStaffModal open={open} onOpenChange={setOpen} staffId="staff-123" candidateSlots={candidateSlots} />
        </div>
    );
}