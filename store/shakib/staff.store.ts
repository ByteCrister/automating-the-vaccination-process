// staff.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";
import type {
    ID,
    ISODateString,
    StaffDomain,
    CreateStaffReq,
    CreateStaffResponse,
    UpdateStaffReq,
    UpdateStaffResponse,
    DeleteStaffResponse,
    StaffSlice,
    Normalized,
    EntityMeta,
    AssignStaffToSlotReq,
    AssignStaffToSlotResp,
} from "@/types/shakib/staff.types";
import { api } from "@/lib/axios";
import { extractErrorMessage } from "@/utils/shakib/extractErrorMessage";
import { CenterOverviewApiDTO } from "@/types/shakib/dashboard.types";

function emptyNormalized<T>(): Normalized<T> {
    return { byId: {}, ids: [] };
}

function upsertNormalized<T extends { id: ID }>(state: Normalized<T>, incoming: T | T[]): Normalized<T> {
    const items = Array.isArray(incoming) ? incoming : [incoming];
    const byId = { ...state.byId };
    const idsSet = new Set(state.ids);
    for (const it of items) {
        byId[it.id] = it;
        idsSet.add(it.id);
    }
    return { byId, ids: Array.from(idsSet) };
}

function removeNormalized<T>(state: Normalized<T>, idToRemove: ID): Normalized<T> {
    const byId = { ...state.byId };
    delete (byId)[idToRemove];
    return { byId, ids: state.ids.filter((id) => id !== idToRemove) };
}

async function retry<T>(fn: () => Promise<T>, attempts = 2, baseMs = 250): Promise<T> {
    let i = 0;
    while (true) {
        try {
            return await fn();
        } catch (err) {
            if (i >= attempts) throw err;
            await new Promise((r) => setTimeout(r, baseMs * Math.pow(2, i)));
        } finally {
            i++;
        }
    }
}

const initialMeta = (): EntityMeta => ({
    loading: false,
    error: null,
    lastFetchedAt: null,
    initialized: false,
    stale: false,
});

type StoreState = StaffSlice;

export const useStaffStore = create<StaffSlice>()(
    devtools(
        (set, get) => ({
            staff: emptyNormalized<StaffDomain>(),
            meta: initialMeta(),

            /* fetchAllStaff: fetch all staff once (no query params) */
            fetchAllStaff: async () => {
                set(
                    produce((s: StoreState) => {
                        s.meta.loading = true;
                        s.meta.error = null;
                    })
                );

                try {
                    // Expecting server to return StaffDomain[] for the all-staff endpoint
                    const res = await retry<StaffDomain[]>(() => api.get("/shakib/mock/centers/staff").then((r) => r.data));
                    const items: StaffDomain[] = Array.isArray(res) ? res : [];

                    set(
                        produce((s: StoreState) => {
                            s.staff = upsertNormalized(s.staff, items);
                            s.meta.loading = false;
                            s.meta.error = null;
                            s.meta.lastFetchedAt = new Date().toISOString();
                            s.meta.initialized = true;
                            s.meta.stale = false;
                        })
                    );
                } catch (err) {
                    const message = extractErrorMessage(err);
                    set(
                        produce((s: StoreState) => {
                            s.meta.loading = false;
                            s.meta.error = message;
                        })
                    );
                    throw err;
                }
            },

            fetchStaffById: async (id: ID) => {
                set(
                    produce((s: StoreState) => {
                        s.meta.loading = true;
                        s.meta.error = null;
                    })
                );

                try {
                    const res = await retry(() => api.get<CreateStaffResponse>(`/shakib/mock/staff/${id}`));
                    const data = res.data.data;
                    if (!data) throw new Error(res.data.error || "No staff returned");
                    set(
                        produce((s: StoreState) => {
                            s.staff = upsertNormalized(s.staff, data);
                            s.meta.loading = false;
                            s.meta.error = null;
                        })
                    );
                } catch (err) {
                    const message = extractErrorMessage(err);
                    set(
                        produce((s: StoreState) => {
                            s.meta.loading = false;
                            s.meta.error = message;
                        })
                    );
                    throw err;
                }
            },

            createStaff: async (payload: CreateStaffReq) => {
                set(
                    produce((s: StoreState) => {
                        s.meta.loading = true;
                        s.meta.error = null;
                    })
                );

                const tempId = `tmp-${Date.now()}`;
                const optimistic: StaffDomain = {
                    id: tempId,
                    userId: null,
                    employeeId: payload.employeeId ?? null,
                    fullName: payload.fullName,
                    preferredName: payload.preferredName ?? null,
                    email: payload.email ?? null,
                    phone: payload.phone ?? null,
                    role: payload.role as string,
                    qualifications: payload.qualifications ?? [],
                    certifications: payload.certifications ?? [],
                    emergencyContact: payload.emergencyContact ?? null,
                    isActive: true,
                    hireDate: payload.hireDate ?? null,
                    endDate: null,
                    shifts: payload.shifts ?? [],
                    permissions: payload.permissions ?? {},
                    assignedDailyCapacity: payload.assignedDailyCapacity ?? null,
                    notes: payload.notes ?? null,
                    lastAppointmentHandledAt: null,
                    lastStockTransactionAt: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isDeleted: false,
                };

                set(
                    produce((s: StoreState) => {
                        s.staff = upsertNormalized(s.staff, optimistic);
                    })
                );

                try {
                    const res = await api.post<CreateStaffResponse>(`/shakib/mock/centers/staff`, payload);
                    const created = res.data.data;
                    if (!created) throw new Error(res.data.error || "No staff returned");
                    set(
                        produce((s: StoreState) => {
                            s.staff = removeNormalized(s.staff, tempId);
                            s.staff = upsertNormalized(s.staff, created);
                            s.meta.loading = false;
                            s.meta.error = null;
                        })
                    );
                } catch (err) {
                    const message = extractErrorMessage(err);
                    set(
                        produce((s: StoreState) => {
                            s.staff = removeNormalized(s.staff, tempId);
                            s.meta.loading = false;
                            s.meta.error = message;
                        })
                    );
                    throw err;
                }
            },

            updateStaff: async (payload: UpdateStaffReq) => {
                set(
                    produce((s: StoreState) => {
                        s.meta.loading = true;
                        s.meta.error = null;
                    })
                );

                const prev = get().staff.byId[payload.id];
                set(
                    produce((s: StoreState) => {
                        const exists = s.staff.byId[payload.id];
                        if (!exists) return;
                        s.staff.byId[payload.id] = { ...exists, ...payload, updatedAt: new Date().toISOString() } as StaffDomain;
                    })
                );

                try {
                    const res = await api.patch<UpdateStaffResponse>(`/shakib/mock/staff/${payload.id}`, payload);
                    const updated = res.data.data;
                    if (!updated) throw new Error(res.data.error || "No staff returned");
                    set(
                        produce((s: StoreState) => {
                            s.staff = upsertNormalized(s.staff, updated);
                            s.meta.loading = false;
                            s.meta.error = null;
                        })
                    );
                } catch (err) {
                    const message = extractErrorMessage(err);
                    set(
                        produce((s: StoreState) => {
                            if (prev) s.staff.byId[prev.id] = prev;
                            s.meta.loading = false;
                            s.meta.error = message;
                        })
                    );
                    throw err;
                }
            },

            removeStaff: async (id: ID) => {
                set(
                    produce((s: StoreState) => {
                        s.meta.loading = true;
                        s.meta.error = null;
                    })
                );

                const prev = get().staff.byId[id];
                set(
                    produce((s: StoreState) => {
                        if (!s.staff.byId[id]) return;
                        s.staff.byId[id] = { ...s.staff.byId[id], isDeleted: true, isActive: false, updatedAt: new Date().toISOString() } as StaffDomain;
                    })
                );

                try {
                    const res = await api.delete<DeleteStaffResponse>(`/shakib/mock/staff/${id}`);
                    if (!res.data.ok) throw new Error(res.data.error || "Delete failed");
                    set(
                        produce((s: StoreState) => {
                            s.staff = removeNormalized(s.staff, id);
                            s.meta.loading = false;
                            s.meta.error = null;
                        })
                    );
                } catch (err) {
                    const message = extractErrorMessage(err);
                    set(
                        produce((s: StoreState) => {
                            if (prev) s.staff.byId[prev.id] = prev;
                            s.meta.loading = false;
                            s.meta.error = message;
                        })
                    );
                    throw err;
                }
            },

            /* local helpers */
            upsertStaff: (items: StaffDomain | StaffDomain[]) => {
                set(
                    produce((s: StoreState) => {
                        s.staff = upsertNormalized(s.staff, items);
                    })
                );
            },

            bulkUpsertStaff: (items: StaffDomain[]) => {
                set(
                    produce((s: StoreState) => {
                        s.staff = upsertNormalized(s.staff, items);
                    })
                );
            },

            setStaffActive: (id: ID, active: boolean) => {
                set(
                    produce((s: StoreState) => {
                        const target = s.staff.byId[id];
                        if (!target) return;
                        target.isActive = active;
                        target.updatedAt = new Date().toISOString();
                        s.staff.byId[id] = target;
                    })
                );
            },

            getStaffArray: () => {
                const s = get().staff;
                return s.ids.map((id) => s.byId[id]);
            },

            getActiveStaffCount: () => {
                return Object.values(get().staff.byId).filter((x) => x && x.isActive && !x.isDeleted).length;
            },

            getOnDutyCountForDate: (dateISO: ISODateString) => {
                try {
                    const dt = new Date(dateISO);
                    const weekday = dt.getUTCDay();
                    const arr = Object.values(get().staff.byId);
                    return arr.filter((s) => {
                        if (!s || !s.shifts || !s.isActive) return false;
                        return s.shifts.some((sh) => sh.dayOfWeek === weekday);
                    }).length;
                } catch {
                    return 0;
                }
            },

            /* assignment actions */
            assignStaffToSlot: async (staffId: ID, slotId: ID) => {
                const staff = get().staff.byId[staffId];
                if (!staff) throw new Error("staff not found");

                set(
                    produce((s: StoreState) => {
                        s.meta.loading = true;
                        s.meta.error = null;
                    })
                );

                try {
                    const payload: AssignStaffToSlotReq = {
                        staffId,
                        slotId,
                        assignedBy: "system",
                        note: null,
                    };
                    const res = await api.post<AssignStaffToSlotResp>(`/shakib/mock/centers/assignments`, payload);
                    if (!res.data.ok) throw new Error(res.data.error || "assignment failed");
                    set(
                        produce((s: StoreState) => {
                            const target = s.staff.byId[staffId];
                            if (target) {
                                target.updatedAt = new Date().toISOString();
                                s.staff.byId[staffId] = target;
                            }
                            s.meta.loading = false;
                            s.meta.error = null;
                        })
                    );
                } catch (err) {
                    const message = extractErrorMessage(err);
                    set(
                        produce((s: StoreState) => {
                            s.meta.loading = false;
                            s.meta.error = message;
                        })
                    );
                    throw err;
                }
            },

            unassignStaffFromSlot: async (staffId: ID, slotId: ID) => {
                const staff = get().staff.byId[staffId];
                if (!staff) throw new Error("staff not found");

                set(
                    produce((s: StoreState) => {
                        s.meta.loading = true;
                        s.meta.error = null;
                    })
                );

                try {
                    await api.delete(`/shakib/mock/centers/assignments`, {
                        data: { staffId, slotId },
                    });
                    set(
                        produce((s: StoreState) => {
                            const target = s.staff.byId[staffId];
                            if (target) target.updatedAt = new Date().toISOString();
                            s.meta.loading = false;
                            s.meta.error = null;
                        })
                    );
                } catch (err) {
                    const message = extractErrorMessage(err);
                    set(
                        produce((s: StoreState) => {
                            s.meta.loading = false;
                            s.meta.error = message;
                        })
                    );
                    throw err;
                }
            },

            /* hydrate / reset */
            hydrateFromOverview: (overview: unknown) => {
                if (!overview || typeof overview !== "object") return;
                const maybe = overview as Partial<CenterOverviewApiDTO>;
                if (!Array.isArray(maybe.staff)) return;
                const staffItems = maybe.staff as StaffDomain[];
                set(
                    produce((s: StoreState) => {
                        s.staff = upsertNormalized(s.staff, staffItems);
                        s.meta.initialized = true;
                        s.meta.lastFetchedAt = new Date().toISOString();
                        s.meta.stale = false;
                        s.meta.error = null;
                    })
                );
            },

            resetStore: () => {
                set(
                    produce((s: StoreState) => {
                        s.staff = emptyNormalized();
                        s.meta = initialMeta();
                    })
                );
            },
        }),
        { name: "staff-store" }
    )
);

export default useStaffStore;
