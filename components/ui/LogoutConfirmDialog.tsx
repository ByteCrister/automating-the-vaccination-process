"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutDialog({ open, onClose, onConfirm }: LogoutDialogProps) {
    // Option 3: temporarily disable smooth scrolling only while modal is open
    useEffect(() => {
        if (!open) return;

        const html = document.documentElement;
        const prevScrollBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";

        return () => {
            html.style.scrollBehavior = prevScrollBehavior;
        };
    }, [open]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Lock background scroll when modal is open
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Ensure we're mounted before using document.body for portal
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {mounted && createPortal(
                <AnimatePresence>
                    {open && (
                        <>
                            <motion.div
                                className="fixed inset-0 w-full h-full bg-transparent"
                                style={{ backdropFilter: "blur(10px)", zIndex: 100 }}
                                aria-hidden="true"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ opacity: { duration: 0.12 } }}
                            />
                            <motion.div
                                className="fixed inset-0 flex min-h-screen items-center justify-center bg-black/60 backdrop-blur-md px-4"
                                style={{ zIndex: 101 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ opacity: { duration: 0.15 } }}
                                aria-modal="true"
                                role="dialog"
                            >
                                <motion.div
                                    className="relative w-full max-w-md p-8 rounded-2xl bg-white/20 dark:bg-gray-900/40
                                                     border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)]
                                                     backdrop-blur-2xl text-center mx-4 max-h-[90vh] overflow-auto"
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, y: 6 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.18 }}
                                >
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-3">
                                        Log out of your account?
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                        You’ll be signed out from this session. You can always log back in anytime.
                                    </p>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            autoFocus
                                            onClick={onClose}
                                            className="px-6 py-2.5 rounded-xl font-medium text-gray-800 dark:text-gray-100
                                                             bg-white/50 dark:bg-gray-800/50
                                                             hover:bg-white/70 dark:hover:bg-gray-700/70
                                                             border border-white/30 transition-all duration-200
                                                             backdrop-blur-md shadow-sm"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={onConfirm}
                                            className="px-6 py-2.5 rounded-xl font-medium text-white
                                                                                                                                             bg-gradient-to-r from-emerald-500 to-emerald-600
                                                                                                                                             hover:from-emerald-600 hover:to-emerald-700
                                                                                                                                             shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>, document.body
            )}
        </>
    );
}
