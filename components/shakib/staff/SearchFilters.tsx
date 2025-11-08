import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiSearch,
    HiFilter,
    HiX,
    HiAdjustments,
    HiSortAscending,
    HiSortDescending,
    HiCalendar,
    HiUserGroup,
    HiCheckCircle,
    HiChevronDown,
} from "react-icons/hi";
import { RiSparklingFill } from "react-icons/ri";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Props interface (adjust based on your actual types)
interface SearchFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    sortKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSortKey: (val: any) => void;
    sortDir: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSortDir: (val: any) => void;
    filtersOpen: boolean;
    setFiltersOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
    roleFilter: string;
    setRoleFilter: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    minCapacity: string | number;
    setMinCapacity: React.Dispatch<React.SetStateAction<number | "">>;
    maxCapacity: string | number;
    setMaxCapacity: React.Dispatch<React.SetStateAction<number | "">>
    hireFrom: string;
    setHireFrom: (val: string) => void;
    hireTo: string;
    setHireTo: (val: string) => void;
    clearFilters: () => void;
    activeFiltersCount: number;
    roles: string[];
}

export function SearchFilters({
    search,
    setSearch,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    filtersOpen,
    setFiltersOpen,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    minCapacity,
    setMinCapacity,
    maxCapacity,
    setMaxCapacity,
    hireFrom,
    setHireFrom,
    hireTo,
    setHireTo,
    clearFilters,
    activeFiltersCount,
    roles,
}: SearchFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card className="border-0 bg-white/90 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
                <div className="p-6">
                    {/* Main Search and Sort Row */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <label htmlFor="staff-search" className="sr-only">
                                Search staff
                            </label>
                            <div className="relative group">
                                <Input
                                    id="staff-search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, email or phone..."
                                    className="h-14 pl-14 pr-12 text-base border-2 border-slate-200/80 bg-linear-to-r from-slate-50 to-white focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300 rounded-2xl font-medium shadow-sm"
                                    aria-label="Search staff"
                                />
                                <motion.div
                                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5"
                                    animate={{
                                        scale: search ? [1, 1.2, 1] : 1,
                                        color: search ? "#8b5cf6" : "#94a3b8",
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <HiSearch className="h-6 w-6" />
                                </motion.div>
                                {search && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setSearch("")}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-violet-600 transition-colors"
                                    >
                                        <HiX className="h-5 w-5" />
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {/* Sort Controls */}
                        <div className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative"
                            >
                                <HiAdjustments className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-600 pointer-events-none z-10" />
                                <select
                                    value={sortKey}
                                    onChange={(e) => setSortKey(e.target.value)}
                                    className="h-12 pl-10 pr-10 rounded-xl border-2 border-slate-200 bg-white font-semibold text-slate-700 hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="fullName">Name</option>
                                    <option value="role">Role</option>
                                    <option value="hireDate">Hire Date</option>
                                    <option value="isActive">Status</option>
                                </select>
                                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                                    className={`h-12 w-12 p-0 rounded-xl transition-all duration-300 shadow-md ${sortDir === "asc"
                                            ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                                            : "bg-linear-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
                                        }`}
                                >
                                    {sortDir === "asc" ? (
                                        <HiSortAscending className="h-6 w-6" />
                                    ) : (
                                        <HiSortDescending className="h-6 w-6" />
                                    )}
                                </Button>
                            </motion.div>

                            {/* Filter Toggle */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            className={`h-12 px-4 border-2 rounded-xl font-semibold transition-all duration-300 shadow-md relative ${filtersOpen
                                                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white border-emerald-400"
                                                    : "border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                                                }`}
                                            onClick={() => setFiltersOpen((v) => !v)}
                                        >
                                            <HiFilter className="h-5 w-5 mr-2" />
                                            Filters
                                            {activeFiltersCount > 0 && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-linear-to-r from-pink-500 to-rose-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white shadow-lg"
                                                >
                                                    {activeFiltersCount}
                                                </motion.span>
                                            )}
                                        </Button>
                                    </motion.div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white font-medium">
                                    {filtersOpen ? "Hide" : "Show"} Advanced Filters
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Expandable Filters Panel */}
                    <AnimatePresence>
                        {filtersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-6 pt-6 border-t-2 border-slate-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <RiSparklingFill className="h-5 w-5 text-violet-600" />
                                        <h3 className="text-lg font-bold text-slate-800">Advanced Filters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Role Filter */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="flex flex-col gap-2"
                                        >
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <HiUserGroup className="h-4 w-4 text-violet-600" />
                                                Role
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={roleFilter}
                                                    onChange={(e) => setRoleFilter(e.target.value)}
                                                    className="h-11 w-full px-4 pr-10 rounded-xl border-2 border-slate-200 bg-white font-medium hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300 appearance-none cursor-pointer"
                                                >
                                                    <option value="">All roles</option>
                                                    {roles.map((r) => (
                                                        <option key={r} value={r}>
                                                            {r}
                                                        </option>
                                                    ))}
                                                </select>
                                                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                            </div>
                                        </motion.div>

                                        {/* Status Filter */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                            className="flex flex-col gap-2"
                                        >
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <HiCheckCircle className="h-4 w-4 text-emerald-600" />
                                                Status
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                    className="h-11 w-full px-4 pr-10 rounded-xl border-2 border-slate-200 bg-white font-medium hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300 appearance-none cursor-pointer"
                                                >
                                                    <option value="any">Any</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                            </div>
                                        </motion.div>

                                        {/* Capacity Range */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex flex-col gap-2"
                                        >
                                            <label className="text-sm font-bold text-slate-700">
                                                Capacity Range
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={minCapacity === "" ? "" : String(minCapacity)}
                                                    onChange={(e) =>
                                                        setMinCapacity(e.target.value === "" ? "" : Number(e.target.value))
                                                    }
                                                    className="h-11 px-4 rounded-xl border-2 border-slate-200 bg-white w-1/2 font-medium hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={maxCapacity === "" ? "" : String(maxCapacity)}
                                                    onChange={(e) =>
                                                        setMaxCapacity(e.target.value === "" ? "" : Number(e.target.value))
                                                    }
                                                    className="h-11 px-4 rounded-xl border-2 border-slate-200 bg-white w-1/2 font-medium hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Hire Date From */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25 }}
                                            className="flex flex-col gap-2"
                                        >
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <HiCalendar className="h-4 w-4 text-blue-600" />
                                                Hire Date From
                                            </label>
                                            <input
                                                type="date"
                                                value={hireFrom}
                                                onChange={(e) => setHireFrom(e.target.value)}
                                                className="h-11 px-4 rounded-xl border-2 border-slate-200 bg-white font-medium hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300"
                                            />
                                        </motion.div>

                                        {/* Hire Date To */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex flex-col gap-2"
                                        >
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <HiCalendar className="h-4 w-4 text-blue-600" />
                                                Hire Date To
                                            </label>
                                            <input
                                                type="date"
                                                value={hireTo}
                                                onChange={(e) => setHireTo(e.target.value)}
                                                className="h-11 px-4 rounded-xl border-2 border-slate-200 bg-white font-medium hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all duration-300"
                                            />
                                        </motion.div>

                                        {/* Action Buttons */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                            className="flex items-end gap-2"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1"
                                            >
                                                <Button
                                                    onClick={() => setFiltersOpen(false)}
                                                    className="w-full h-11 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <HiCheckCircle className="mr-2 h-5 w-5" />
                                                    Apply
                                                </Button>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1"
                                            >
                                                <Button
                                                    onClick={clearFilters}
                                                    variant="outline"
                                                    className="w-full h-11 rounded-xl bg-white border-2 border-slate-200 font-bold hover:bg-slate-50 transition-all duration-300"
                                                >
                                                    <HiX className="mr-2 h-5 w-5" />
                                                    Clear
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Filter Chips */}
                    <AnimatePresence>
                        {activeFiltersCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-bold text-slate-600">Active Filters:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {search && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-violet-100 to-purple-100 text-violet-800 font-bold text-sm border-2 border-violet-200 shadow-sm flex items-center gap-2"
                                        >
                                            <HiSearch className="h-4 w-4" />
                                            Search: {search}
                                            <button
                                                onClick={() => setSearch("")}
                                                className="hover:bg-violet-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <HiX className="h-3 w-3" />
                                            </button>
                                        </motion.span>
                                    )}
                                    {roleFilter && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm border-2 border-emerald-200 shadow-sm flex items-center gap-2"
                                        >
                                            <HiUserGroup className="h-4 w-4" />
                                            Role: {roleFilter}
                                            <button
                                                onClick={() => setRoleFilter("")}
                                                className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <HiX className="h-3 w-3" />
                                            </button>
                                        </motion.span>
                                    )}
                                    {statusFilter !== "any" && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-blue-100 to-cyan-100 text-blue-800 font-bold text-sm border-2 border-blue-200 shadow-sm flex items-center gap-2"
                                        >
                                            <HiCheckCircle className="h-4 w-4" />
                                            Status: {statusFilter}
                                            <button
                                                onClick={() => setStatusFilter("any")}
                                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <HiX className="h-3 w-3" />
                                            </button>
                                        </motion.span>
                                    )}
                                    {hireFrom && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-pink-100 to-rose-100 text-pink-800 font-bold text-sm border-2 border-pink-200 shadow-sm flex items-center gap-2"
                                        >
                                            <HiCalendar className="h-4 w-4" />
                                            From: {hireFrom}
                                        </motion.span>
                                    )}
                                    {hireTo && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-pink-100 to-rose-100 text-pink-800 font-bold text-sm border-2 border-pink-200 shadow-sm flex items-center gap-2"
                                        >
                                            <HiCalendar className="h-4 w-4" />
                                            To: {hireTo}
                                        </motion.span>
                                    )}
                                    {minCapacity !== "" && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-amber-100 to-orange-100 text-amber-800 font-bold text-sm border-2 border-amber-200 shadow-sm"
                                        >
                                            Min Capacity: {minCapacity}
                                        </motion.span>
                                    )}
                                    {maxCapacity !== "" && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-amber-100 to-orange-100 text-amber-800 font-bold text-sm border-2 border-amber-200 shadow-sm"
                                        >
                                            Max Capacity: {maxCapacity}
                                        </motion.span>
                                    )}
                                    {(sortKey !== "fullName" || sortDir !== "asc") && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-4 py-2 rounded-full bg-linear-to-r from-indigo-100 to-blue-100 text-indigo-800 font-bold text-sm border-2 border-indigo-200 shadow-sm flex items-center gap-2"
                                        >
                                            {sortDir === "asc" ? (
                                                <HiSortAscending className="h-4 w-4" />
                                            ) : (
                                                <HiSortDescending className="h-4 w-4" />
                                            )}
                                            Sort: {sortKey} {sortDir}
                                        </motion.span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.div>
    );
}