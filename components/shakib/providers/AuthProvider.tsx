"use client";

import { useAuthStore } from "@/store/shakib/user-auth.store";
import React, { JSX, useEffect } from "react";

type Props = {
    children: React.ReactNode;
};

export default function AuthProvider({ children }: Props): JSX.Element {
    const { user, loading } = useAuthStore();

    useEffect(() => {
        if (!user && loading !== "loading") {
            // call via getState to keep effect dependencies stable and avoid re-renders
            useAuthStore.getState().fetchCurrentUser().catch(() => {
                // store handles and records errors; swallow to avoid unhandled rejection warnings
            });
        }

        return () => {
            const controller = useAuthStore.getState().abortController;
            if (controller) {
                controller.abort();
            }
        };
        // dependencies intentionally limited to runtime state only
    }, [user, loading]);

    return <>{children}</>;
}
