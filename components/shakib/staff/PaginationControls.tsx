"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiChevronDoubleLeft,
    HiChevronDoubleRight,
    HiChevronLeft,
    HiChevronRight,
    HiViewGrid,
    HiCheckCircle,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PaginationControlsProps {
    page: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
    onPageChange: (newPage: number) => void;
    onPageSizeChange?: (size: number) => void;
    maxPageButtons?: number;
}

function createRange(start: number, end: number) {
    const r: number[] = [];
    for (let i = start; i <= end; i++) r.push(i);
    return r;
}

export function PaginationControls({
    page,
    pageSize,
    total,
    pageSizeOptions = [10, 20, 50],
    onPageChange,
    onPageSizeChange,
    maxPageButtons = 5,
}: PaginationControlsProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const showPrev = page > 1;
    const showNext = page < totalPages;

    const half = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, page - half);
    const end = Math.min(totalPages, start + maxPageButtons - 1);
    if (end - start + 1 < maxPageButtons) start = Math.max(1, end - maxPageButtons + 1);
    const pages = createRange(start, end);

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.12 } },
        tap: { scale: 0.96 },
    };

    const pageButtonVariants = {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
    };

    return (
        <div className="w-full flex justify-center">
            <div className="max-w-3xl w-full">
                <div className="flex items-center justify-center">
                    <div className="flex w-full items-center justify-between gap-4 p-4 rounded-2xl shadow-2xl"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(1,120,87,0.12) 0%, rgba(6,95,70,0.06) 50%, rgba(1,120,87,0.04) 100%)",
                            border: "1px solid rgba(10,120,80,0.12)",
                            backdropFilter: "saturate(140%) blur(6px)",
                        }}>
                        {/* Left info */}
                        <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 min-w-[220px]"
                        >
                            <Badge
                                variant="outline"
                                className="px-3 py-2 text-sm font-semibold text-emerald-800"
                                style={{
                                    background: "linear-gradient(90deg, rgba(237,253,245,0.9), rgba(240,255,249,0.85))",
                                    border: "1px solid rgba(6,95,70,0.08)",
                                }}
                            >
                                <HiCheckCircle className="mr-2 inline-block h-4 w-4 text-emerald-700" />
                                {total} Total
                            </Badge>

                            <span className="text-sm text-emerald-900 font-medium">
                                Page <span className="text-emerald-700 font-bold">{page}</span> of{" "}
                                <span className="font-bold text-emerald-700">{totalPages}</span>
                            </span>
                        </motion.div>

                        {/* Center navigation */}
                        <div className="flex items-center gap-2">
                            {/* First */}
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPageChange(1)}
                                    disabled={!showPrev}
                                    className={`h-10 w-10 p-0 rounded-xl transition-all duration-200 ${showPrev ? "hover:shadow-lg" : "opacity-40 cursor-not-allowed"}`}
                                    aria-label="First page"
                                    style={{
                                        background: showPrev ? "linear-gradient(180deg,#065f46,#047857)" : "transparent",
                                        color: showPrev ? "white" : undefined,
                                        border: showPrev ? "1px solid rgba(255,255,255,0.06)" : undefined,
                                    }}
                                >
                                    <HiChevronDoubleLeft className="h-5 w-5" />
                                </Button>
                            </motion.div>

                            {/* Prev */}
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPageChange(Math.max(1, page - 1))}
                                    disabled={!showPrev}
                                    className={`h-10 w-10 p-0 rounded-xl transition-all duration-200 ${showPrev ? "hover:shadow-lg" : "opacity-40 cursor-not-allowed"}`}
                                    aria-label="Previous page"
                                    style={{
                                        background: showPrev ? "linear-gradient(180deg,#10b981,#059669)" : "transparent",
                                        color: showPrev ? "white" : undefined,
                                    }}
                                >
                                    <HiChevronLeft className="h-5 w-5" />
                                </Button>
                            </motion.div>

                            {/* Page numbers */}
                            <div className="flex items-center gap-2">
                                {start > 1 && (
                                    <>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onPageChange(1)}
                                                className="h-10 min-w-10 px-3 rounded-xl font-semibold transition-all duration-200 bg-white text-emerald-800 border border-emerald-100"
                                            >
                                                1
                                            </Button>
                                        </motion.div>
                                        {start > 2 && <span className="px-2 text-slate-400 font-bold">…</span>}
                                    </>
                                )}

                                <AnimatePresence mode="popLayout">
                                    {pages.map((p) => (
                                        <motion.div key={p} variants={pageButtonVariants} initial="hidden" animate="visible" exit="exit" layout>
                                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                                <Button
                                                    size="sm"
                                                    onClick={() => onPageChange(p)}
                                                    className={`h-10 min-w-10 px-3 rounded-xl font-bold transition-all duration-200 ${p === page ? "shadow-xl" : "bg-white text-emerald-800 border border-emerald-100"}`}
                                                    style={
                                                        p === page
                                                            ? {
                                                                background: "linear-gradient(90deg,#16a34a,#059669)",
                                                                color: "white",
                                                                boxShadow: "0 8px 20px rgba(8,145,108,0.18)",
                                                                border: "1px solid rgba(255,255,255,0.06)",
                                                            }
                                                            : undefined
                                                    }
                                                    aria-current={p === page ? "page" : undefined}
                                                >
                                                    {p}
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {end < totalPages && (
                                    <>
                                        {end < totalPages - 1 && <span className="px-2 text-slate-400 font-bold">…</span>}
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onPageChange(totalPages)}
                                                className="h-10 min-w-10 px-3 rounded-xl font-semibold transition-all duration-200 bg-white text-emerald-800 border border-emerald-100"
                                            >
                                                {totalPages}
                                            </Button>
                                        </motion.div>
                                    </>
                                )}
                            </div>

                            {/* Next */}
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                                    disabled={!showNext}
                                    className={`h-10 w-10 p-0 rounded-xl transition-all duration-200 ${showNext ? "hover:shadow-lg" : "opacity-40 cursor-not-allowed"}`}
                                    aria-label="Next page"
                                    style={{
                                        background: showNext ? "linear-gradient(180deg,#06b6d4,#059669)" : "transparent",
                                        color: showNext ? "white" : undefined,
                                    }}
                                >
                                    <HiChevronRight className="h-5 w-5" />
                                </Button>
                            </motion.div>

                            {/* Last */}
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPageChange(totalPages)}
                                    disabled={!showNext}
                                    className={`h-10 w-10 p-0 rounded-xl transition-all duration-200 ${showNext ? "hover:shadow-lg" : "opacity-40 cursor-not-allowed"}`}
                                    aria-label="Last page"
                                    style={{
                                        background: showNext ? "linear-gradient(180deg,#047857,#064e3b)" : "transparent",
                                        color: showNext ? "white" : undefined,
                                    }}
                                >
                                    <HiChevronDoubleRight className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right: page size */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 min-w-[180px] justify-end">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                style={{
                                    background: "linear-gradient(90deg, rgba(240,255,249,0.95), rgba(237,253,245,0.9))",
                                    border: "1px solid rgba(6,95,70,0.06)",
                                }}>
                                <HiViewGrid className="h-4 w-4 text-emerald-700" />
                                <span className="text-sm text-emerald-800 font-medium">Show</span>
                                <select
                                    className="text-sm font-bold text-emerald-800 bg-transparent border-none outline-none cursor-pointer"
                                    value={pageSize}
                                    onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                                >
                                    {pageSizeOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-sm text-emerald-800 font-medium">items</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginationControls;
