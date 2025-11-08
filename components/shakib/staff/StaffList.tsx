"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import {
    HiUserGroup,
    HiMail,
    HiPhone,
    HiShieldCheck,
    HiSparkles,
    HiPencil,
    HiTrash,
    HiCheckCircle,
    HiXCircle,
    HiFilter,
    HiUserAdd,
} from "react-icons/hi";
import { RiUserStarFill } from "react-icons/ri";

import useStaffStore from "@/store/shakib/staff.store";
import { StaffFormModal } from "./StaffFormModal";
import { StaffListSkeleton } from "./skeletons";

/* shadcn-style primitives — adjust paths if needed */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import PaginationControls from "./PaginationControls";
import { usePagination } from "@/hooks/shakib/usePagination";

import { SearchFilters } from "./SearchFilters"; // <-- new import (adjust path if needed)

type SortKey = "fullName" | "role" | "hireDate" | "isActive";
type SortDir = "asc" | "desc";

export function StaffList(): JSX.Element {
    const { fetchAllStaff, removeStaff, setStaffActive, getStaffArray, meta } = useStaffStore();
    const staffArray = getStaffArray();

    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState<null | string>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    /* Advanced filter state */
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>(""); // empty = all
    const [statusFilter, setStatusFilter] = useState<"any" | "active" | "inactive">("any");
    const [hireFrom, setHireFrom] = useState<string | "">("");
    const [hireTo, setHireTo] = useState<string | "">("");
    const [minCapacity, setMinCapacity] = useState<number | "">("");
    const [maxCapacity, setMaxCapacity] = useState<number | "">("");

    /* Sort state */
    const [sortKey, setSortKey] = useState<SortKey>("fullName");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    useEffect(() => {
        fetchAllStaff();
    }, [fetchAllStaff]);

    /* helper: extract unique roles from current dataset */
    const roles = useMemo(() => {
        const set = new Set<string>();
        for (const s of staffArray) set.add(s.role as string);
        return Array.from(set).sort();
    }, [staffArray]);

    /* combined filter + search + sort pipeline */
    const processed = useMemo(() => {
        const q = search.trim().toLowerCase();
        let arr = staffArray.slice();

        /* apply search (name, email, phone) */
        if (q) {
            arr = arr.filter(
                (s) =>
                    s.fullName.toLowerCase().includes(q) ||
                    (s.email ?? "").toLowerCase().includes(q) ||
                    (s.phone ?? "").toLowerCase().includes(q)
            );
        }

        /* apply role filter */
        if (roleFilter) {
            arr = arr.filter((s) => (s.role as string) === roleFilter);
        }

        /* apply status filter */
        if (statusFilter === "active") arr = arr.filter((s) => s.isActive && !s.isDeleted);
        if (statusFilter === "inactive") arr = arr.filter((s) => !s.isActive && !s.isDeleted);

        /* hire date range */
        if (hireFrom) {
            const fromDt = new Date(hireFrom);
            arr = arr.filter((s) => (s.hireDate ? new Date(s.hireDate) >= fromDt : false));
        }
        if (hireTo) {
            const toDt = new Date(hireTo);
            arr = arr.filter((s) => (s.hireDate ? new Date(s.hireDate) <= toDt : false));
        }

        /* capacity range */
        if (minCapacity !== "") {
            arr = arr.filter((s) => (s.assignedDailyCapacity ?? 0) >= Number(minCapacity));
        }
        if (maxCapacity !== "") {
            arr = arr.filter((s) => (s.assignedDailyCapacity ?? 0) <= Number(maxCapacity));
        }

        /* sorting */
        arr.sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1;
            switch (sortKey) {
                case "fullName": {
                    return a.fullName.localeCompare(b.fullName) * dir;
                }
                case "role": {
                    return String(a.role).localeCompare(String(b.role)) * dir;
                }
                case "hireDate": {
                    const da = a.hireDate ? new Date(a.hireDate).getTime() : 0;
                    const db = b.hireDate ? new Date(b.hireDate).getTime() : 0;
                    return (da - db) * dir;
                }
                case "isActive": {
                    return (Number(a.isActive) - Number(b.isActive)) * -dir; // active first when asc
                }
                default:
                    return 0;
            }
        });

        return arr;
    }, [
        staffArray,
        search,
        roleFilter,
        statusFilter,
        hireFrom,
        hireTo,
        minCapacity,
        maxCapacity,
        sortKey,
        sortDir,
    ]);

    const { paginated, total } = usePagination(processed, page, pageSize);

    useEffect(() => {
        // reset to first page when filters, search or data length change
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [search, roleFilter, statusFilter, hireFrom, hireTo, minCapacity, maxCapacity, sortKey, sortDir, staffArray.length]);

    /* animation variants (unchanged) */
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 },
        },
    };

    /* small helpers */
    const activeFiltersCount = useMemo(() => {
        let n = 0;
        if (search) n++;
        if (roleFilter) n++;
        if (statusFilter !== "any") n++;
        if (hireFrom) n++;
        if (hireTo) n++;
        if (minCapacity !== "") n++;
        if (maxCapacity !== "") n++;
        if (sortKey !== "fullName" || sortDir !== "asc") n++; // count custom sort as active
        return n;
    }, [search, roleFilter, statusFilter, hireFrom, hireTo, minCapacity, maxCapacity, sortKey, sortDir]);

    const clearFilters = () => {
        setSearch("");
        setRoleFilter("");
        setStatusFilter("any");
        setHireFrom("");
        setHireTo("");
        setMinCapacity("");
        setMaxCapacity("");
        setSortKey("fullName");
        setSortDir("asc");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-4 sm:p-6 lg:p-8">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
      `}</style>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: "spring" }} className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-green-500 to-teal-500 p-8 sm:p-10 shadow-2xl">
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                        <motion.div animate={{ rotate: [360, 0], scale: [1, 1.3, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="relative">
                                <div className="absolute inset-0 bg-white/40 rounded-2xl blur-xl" />
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
                                    <HiUserGroup className="h-10 w-10 text-white drop-shadow-lg" />
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-2xl bg-white/20" />
                                </div>
                            </motion.div>

                            <div>
                                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Staff Directory
                                </motion.h1>

                                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="mt-2 text-base text-emerald-50 font-medium">
                                    Manage your team with elegance and efficiency
                                </motion.p>

                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="mt-3 flex items-center gap-4 text-sm text-emerald-100">
                                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                        <HiSparkles className="h-4 w-4" />
                                        {processed.length} Members
                                    </span>
                                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                        <HiShieldCheck className="h-4 w-4" />
                                        All Systems Ready
                                    </span>
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="text-sm text-emerald-100">Filters</div>
                                <Button onClick={() => setFiltersOpen((v) => !v)} className="h-12 px-3 bg-white/20 text-white border border-white/30 rounded-xl">
                                    <HiFilter className="h-5 w-5 mr-2" />
                                    {activeFiltersCount > 0 ? `${activeFiltersCount}` : "0"}
                                </Button>
                            </div>

                            <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="h-14 bg-white px-8 text-emerald-600 shadow-2xl hover:bg-emerald-50 hover:shadow-3xl transition-all duration-300 font-bold text-base rounded-xl border-2 border-white/50">
                                <HiUserAdd className="mr-2 h-6 w-6" />
                                Add New Staff
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Search + Filters + Sort replaced with SearchFilters component */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <SearchFilters
                        search={search}
                        setSearch={setSearch}
                        sortKey={sortKey}
                        setSortKey={(v) => setSortKey(v as SortKey)}
                        sortDir={sortDir}
                        setSortDir={(v) => setSortDir(v as SortDir)}
                        filtersOpen={filtersOpen}
                        setFiltersOpen={setFiltersOpen}
                        roleFilter={roleFilter}
                        setRoleFilter={setRoleFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={(v) => setStatusFilter(v as "any" | "active" | "inactive")}
                        minCapacity={minCapacity}
                        setMinCapacity={setMinCapacity}
                        maxCapacity={maxCapacity}
                        setMaxCapacity={setMaxCapacity}
                        hireFrom={hireFrom as string}
                        setHireFrom={setHireFrom}
                        hireTo={hireTo as string}
                        setHireTo={setHireTo}
                        clearFilters={clearFilters}
                        activeFiltersCount={activeFiltersCount}
                        roles={roles}
                    />
                </motion.div>

                {/* Staff list */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
                        {meta.loading ? (
                            <div className="p-8">
                                <StaffListSkeleton rows={6} />
                            </div>
                        ) : processed.length === 0 ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-16 text-center">
                                <div className="mx-auto max-w-md">
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="mb-8 inline-flex items-center justify-center h-28 w-28 rounded-full bg-linear-to-br from-emerald-100 via-green-100 to-teal-100 text-emerald-600 shadow-xl">
                                        <HiUserGroup className="h-14 w-14" />
                                    </motion.div>

                                    <h4 className="mb-4 text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No Staff Members Found</h4>
                                    <p className="mb-8 text-slate-600 text-lg">{search ? "Try adjusting your search or filters" : "Start building your dream team today"}</p>

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="h-14 bg-linear-to-r from-emerald-600 to-teal-600 px-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-base rounded-xl">
                                            <HiUserAdd className="mr-2 h-6 w-6" /> Add Your First Staff Member
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-slate-100">
                                <AnimatePresence mode="popLayout">
                                    {paginated.map((s) => (
                                        <motion.div key={s.id} variants={itemVariants} layout exit="exit" whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.03)", transition: { duration: 0.2 } }} className="group relative">
                                            <motion.div initial={{ scaleY: 0 }} whileHover={{ scaleY: 1 }} transition={{ duration: 0.3 }} className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-emerald-500 via-green-500 to-teal-500 origin-top rounded-r-full" />
                                            <div className="px-8 py-6">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                    <div className="flex items-center gap-5 min-w-0 flex-1">
                                                        <motion.div className="relative shrink-0" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                            <Avatar className="h-16 w-16 ring-4 ring-white shadow-xl bg-linear-to-br from-emerald-400 via-green-400 to-teal-400">
                                                                <AvatarFallback className="bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-800 text-lg font-bold">
                                                                    {s.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            {s.isActive && (
                                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-1 -right-1">
                                                                    <div className="relative">
                                                                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-green-400 rounded-full blur-sm" />
                                                                        <HiCheckCircle className="relative h-6 w-6 text-green-500 bg-white rounded-full" />
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </motion.div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                <h4 className="text-lg font-bold text-slate-900 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.fullName}</h4>
                                                                <motion.div whileHover={{ scale: 1.1 }}>
                                                                    <Badge className="px-3 py-1 text-xs font-bold bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 border-2 border-emerald-200 shadow-sm">
                                                                        <RiUserStarFill className="mr-1 h-3 w-3" />
                                                                        {s.role}
                                                                    </Badge>
                                                                </motion.div>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-sm text-slate-600">
                                                                {s.email && (
                                                                    <motion.span whileHover={{ x: 2 }} className="flex items-center gap-2 truncate font-medium">
                                                                        <HiMail className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                        {s.email}
                                                                    </motion.span>
                                                                )}
                                                                {s.phone && (
                                                                    <motion.span whileHover={{ x: 2 }} className="flex items-center gap-2 font-medium">
                                                                        <HiPhone className="h-4 w-4 text-teal-500 shrink-0" />
                                                                        {s.phone}
                                                                    </motion.span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button size="sm" onClick={() => setStaffActive(s.id, !s.isActive)} className={`h-10 px-5 font-bold transition-all duration-300 rounded-lg shadow-md ${s.isActive ? "bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-green-200" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`} aria-pressed={s.isActive}>
                                                                {s.isActive ? (<><HiCheckCircle className="mr-1.5 h-4 w-4" />Active</>) : (<><HiXCircle className="mr-1.5 h-4 w-4" />Inactive</>)}
                                                            </Button>
                                                        </motion.div>

                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button size="sm" onClick={() => { setEditing(s.id); setModalOpen(true); }} className="h-10 px-5 bg-blue-500 text-white hover:bg-blue-600 font-bold rounded-lg shadow-md shadow-blue-200 transition-all duration-300">
                                                                <HiPencil className="mr-1.5 h-4 w-4" /> Edit
                                                            </Button>
                                                        </motion.div>

                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button size="sm" onClick={() => removeStaff(s.id)} className="h-10 px-5 bg-red-500 text-white hover:bg-red-600 font-bold rounded-lg shadow-md shadow-red-200 transition-all duration-300">
                                                                <HiTrash className="mr-1.5 h-4 w-4" /> Delete
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            </motion.div>

            <StaffFormModal open={modalOpen} onOpenChange={setModalOpen} initial={editing ? staffArray.find((x) => x.id === editing) ?? null : null} />

            <div className="mt-4 flex items-center justify-end">
                <PaginationControls page={page} pageSize={pageSize} total={total} onPageChange={(p) => setPage(p)} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} pageSizeOptions={[10, 20, 50, 100]} />
            </div>
        </div>
    );
}
