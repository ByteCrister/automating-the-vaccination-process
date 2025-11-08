// stores/useAuthStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IUser, LoadingState } from "@/types/shakib/user.auth.types";
import { api } from "@/lib/axios";
import { extractErrorMessage } from "@/utils/shakib/extractErrorMessage";

type FetchOpts = { force?: boolean };

export type AuthState = {
  user: IUser | null;
  loading: LoadingState;
  error: string | null;
  setUser: (u: IUser | null) => void;
  setLoading: (s: LoadingState) => void;
  setError: (err: string | null) => void;
  fetchCurrentUser: (opts?: FetchOpts) => Promise<IUser | null>;
  refresh: () => Promise<IUser | null>;
  clear: () => void;
};

// Internal runtime helpers — not part of the public API surface
type AuthInternal = {
  inFlight: Promise<IUser | null> | null;
  abortController: AbortController | null;
};

// Combined store type that create(...) will use
type Store = AuthState & AuthInternal;

export const useAuthStore = create<Store>()(
  devtools((set, get) => ({
    // public state
    user: null,
    loading: "idle",
    error: null,

    // internal runtime state
    inFlight: null,
    abortController: null,

    setUser: (u) => {
      set({
        user: u,
        error: null,
        loading: u ? "success" : "idle",
      });
    },

    setLoading: (s) => {
      set({ loading: s });
    },

    setError: (err) => {
      set({ error: err, loading: err ? "error" : get().loading });
    },

    fetchCurrentUser: async ({ force = false } = {}) => {
      const state = get();

      if (state.user && !force) {
        return state.user;
      }

      if (state.inFlight) {
        return state.inFlight;
      }

      const controller = new AbortController();
      set({ abortController: controller });

      const promise = (async (): Promise<IUser | null> => {
        set({ loading: "loading", error: null });
        try {
          const res = await api.get<{ user: IUser | null }>("/shakib/auth/user", {
            signal: controller.signal,
          });

          const fetched = res.data?.user ?? null;
          set({ user: fetched, loading: "success", error: null });
          return fetched;
        } catch (errorUnknown) {
          // Determine if request was canceled
          const err = errorUnknown as { name?: string; code?: string; message?: string; response?: { status?: number } };

          const isCanceled =
            err?.name === "CanceledError" ||
            err?.message === "canceled" ||
            err?.code === "ERR_CANCELED";

          if (isCanceled) {
            // Clear internal tokens but keep previous user/state
            set({ inFlight: null, abortController: null });
            return get().user;
          }

          const message = extractErrorMessage(errorUnknown);
          const status = err?.response?.status;

          if (status === 401 || status === 403) {
            // treat as unauthenticated but successful load
            set({ user: null, loading: "success", error: null });
            return null;
          }

          set({ user: null, loading: "error", error: message });
          return null;
        } finally {
          set({ inFlight: null, abortController: null });
        }
      })();

      set({ inFlight: promise });
      return promise;
    },

    refresh: async () => get().fetchCurrentUser({ force: true }),

    clear: () => {
      const controller = get().abortController;
      if (controller) {
        controller.abort();
      }
      set({ user: null, loading: "idle", error: null, inFlight: null, abortController: null });
    },
  }))
);
