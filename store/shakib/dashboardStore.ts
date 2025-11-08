// src/store/dashboardStore.ts
import {create} from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type {
  DashboardStore,
  CenterOverviewApiDTO,
  CenterDTO,
  ID,
  EntityMeta,
  Normalized,
  SlotDomain,
  BookingDomain,
  StaffDomain,
  VaccineStockItem,
  StockMovement,
  Reminder,
  CenterMetrics,
  Paginated,
} from '@/types/shakib/dashboard.types'; 

/* -----------------------
   Helper utilities
   ----------------------- */

const nowISO = () => new Date().toISOString();

const defaultMeta = (): EntityMeta => ({ loading: false, error: null, lastFetchedAt: null });

function upsertNormalized<T extends { id: ID }>(state: Normalized<T>, incoming: T | T[]): Normalized<T> {
  const arr = Array.isArray(incoming) ? incoming : [incoming];
  const byId = { ...state.byId };
  const ids = new Set(state.ids);
  for (const item of arr) {
    byId[item.id] = item;
    ids.add(item.id);
  }
  return { byId, ids: Array.from(ids) };
}

function removeFromNormalized<T>(state: Normalized<T>, idToRemove: ID): Normalized<T> {
  if (!state.byId[idToRemove]) return state;
  const byId = { ...state.byId };
  delete byId[idToRemove];
  return { byId, ids: state.ids.filter((id) => id !== idToRemove) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adjustEntityNumeric<T extends Record<string, any>>(state: Normalized<T>, id: ID, patch: Partial<T>): Normalized<T> {
  const entity = state.byId[id];
  if (!entity) return state;
  return { byId: { ...state.byId, [id]: { ...entity, ...patch } }, ids: state.ids };
}

function initialNormalized<T>(): Normalized<T> {
  return { byId: {} as Record<ID, T>, ids: [] };
}

/* -----------------------
   Initial store shape
   ----------------------- */

const initialState = (): Partial<DashboardStore> => ({
  // base/hydration
  hydrated: false,

  // Center slice
  centerId: null,
  center: null,
  meta: defaultMeta(),

  // Metrics
  metrics: null,
  // metrics uses same meta property name so keep consistent

  // Staff
  staff: initialNormalized<StaffDomain>(),
  // Slots
  slots: initialNormalized<SlotDomain>(),
  upcomingIds: [],
  // Bookings
  bookings: initialNormalized<BookingDomain>(),
  todaysIds: [],
  // Stock
  items: initialNormalized<VaccineStockItem>(),
  movements: [] as StockMovement[],
  // Reminders
  reminders: initialNormalized<Reminder>(),
  // Analytics
  bookingTrends: [],
  mostBookedSlots: [],
  loading: false,
  error: null,
});

/* -----------------------
   Store implementation
   ----------------------- */

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // seed initial values
      ...initialState(),

      /* -----------------------
         Hydration and reset
         ----------------------- */

      hydrateFromOverview: (overview: CenterOverviewApiDTO) => {
        if (!overview) return;
        set(() => {
          // normalize slots, bookings, staff, stock, movements, reminders, audits
          const slotsNormalized = upsertNormalized<SlotDomain>(initialNormalized<SlotDomain>(), overview.upcomingSlots.map((u) => u.slot));
          const staffNormalized = upsertNormalized<StaffDomain>(initialNormalized<StaffDomain>(), overview.staff || []);
          const bookingsNormalized = upsertNormalized<BookingDomain>(initialNormalized<BookingDomain>(), overview.todaysBookings.map((b) => b.booking));
          const stockNormalized = upsertNormalized<VaccineStockItem>(initialNormalized<VaccineStockItem>(), overview.stockSummary || []);
          const remindersNormalized = upsertNormalized<Reminder>(initialNormalized<Reminder>(), overview.pendingReminders || []);
          return {
            hydrated: true,
            centerId: overview.center.id,
            center: overview.center,
            metrics: overview.metrics,
            staff: staffNormalized,
            slots: slotsNormalized,
            // upcoming IDs sorted by startTime (server already sorted often, ensure)
            upcomingIds: Object.values(slotsNormalized.byId)
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((s) => s.id),
            bookings: bookingsNormalized,
            todaysIds: overview.todaysBookings.map((b) => b.booking.id),
            items: stockNormalized,
            movements: overview.recentStockMovements || [],
            reminders: remindersNormalized,
            // audits not stored normalized here by default
            // update metas
            meta: { ...get().meta, loading: false, error: null, lastFetchedAt: nowISO() },
          };
        });
      },

      resetStore: () => {
        set(() => ({ ...initialState(), hydrated: false }));
      },

      /* -----------------------
         Center slice
         ----------------------- */

      fetchCenter: async (centerId, opts = { force: false }) => {
        try {
          set((s) => ({ meta: { ...s.meta, loading: true, error: null } }));
          const { data } = await api.get(`/centers/${centerId}`);
          set((s) => ({ center: data, centerId: centerId, meta: { ...s.meta, loading: false, lastFetchedAt: nowISO() } }));
        } catch (err) {
          const message = extractErrorMessage(err as unknown);
          set((s) => ({ meta: { ...s.meta, loading: false, error: message } }));
        }
      },

      setCenter: (c: CenterDTO) => set(() => ({ center: c, centerId: c.id })),

      clearCenter: () => set(() => ({ center: null, centerId: null })),

      /* -----------------------
         Metrics slice
         ----------------------- */

      refreshMetrics: async (centerId) => {
        try {
          set((s) => ({ meta: { ...s.meta, loading: true, error: null } }));
          const res = await api.get(`/centers/${centerId}/metrics`);
          set((s) => ({ metrics: res.data, meta: { ...s.meta, loading: false, lastFetchedAt: nowISO() } }));
        } catch (err) {
          set((s) => ({ meta: { ...s.meta, loading: false, error: extractErrorMessage(err as unknown) } }));
        }
      },

      setMetrics: (m: CenterMetrics) => set(() => ({ metrics: m })),

      /* -----------------------
         Staff slice
         ----------------------- */

      fetchStaff: async (centerId, opts = { page: 1, pageSize: 50 }) => {
        try {
          set((s) => ({ meta: { ...s.meta, loading: true, error: null } }));
          const q = `?page=${opts.page}&pageSize=${opts.pageSize}`;
          const res = await api.get<Paginated<StaffDomain>>(`/centers/${centerId}/staff${q}`);
          set((s) => ({ staff: upsertNormalized<StaffDomain>(s.staff, res.data.items), meta: { ...s.meta, loading: false, lastFetchedAt: nowISO() } }));
        } catch (err) {
          set((s) => ({ meta: { ...s.meta, loading: false, error: extractErrorMessage(err as unknown) } }));
        }
      },

      upsertStaff: (items) =>
        set((s) => ({ staff: upsertNormalized<StaffDomain>(s.staff, items as StaffDomain | StaffDomain[]) })),

      removeStaff: (id) => set((s) => ({ staff: removeFromNormalized(s.staff, id) })),

      getStaffArray: () => Object.values(get().staff.byId),

      getOnDutyStaffCountForDate: (dateISO) => {
        // simple heuristic: count staff who have shifts matching day (server should provide on-duty meta for accuracy)
        const date = new Date(dateISO);
        const dow = date.getDay();
        return Object.values(get().staff.byId).filter((st) => (st.shifts || []).some((sh) => sh.dayOfWeek === dow && st.isActive)).length;
      },

      assignStaffToSlot: async (staffId, slotId) => {
        try {
          await api.post(`/staff/${staffId}/assign`, { slotId });
          // optimistic local: no structural change by default; rely on subsequent fetch
        } catch (err) {
          // swallow and surface error via center meta
          set((s) => ({ meta: { ...s.meta, error: extractErrorMessage(err as unknown) } }));
        }
      },

      /* -----------------------
         Slots slice
         ----------------------- */

      fetchSlots: async (centerId, opts = {}) => {
        try {
          set((s) => ({ meta: { ...s.meta, loading: true, error: null } }));
          const q = new URLSearchParams();
          if (opts.from) q.set('from', opts.from);
          if (opts.to) q.set('to', opts.to);
          if (opts.page) q.set('page', String(opts.page));
          if (opts.pageSize) q.set('pageSize', String(opts.pageSize));
          const res = await api.get<{ items: SlotDomain[] }>(`/centers/${centerId}/slots?${q.toString()}`);
          set((s) => {
            const normalized = upsertNormalized<SlotDomain>(s.slots, res.data.items);
            const sortedIds = Object.values(normalized.byId)
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((x) => x.id);
            return { slots: normalized, upcomingIds: sortedIds, meta: { ...s.meta, loading: false, lastFetchedAt: nowISO() } };
          });
        } catch (err) {
          set((s) => ({ meta: { ...s.meta, loading: false, error: extractErrorMessage(err as unknown) } }));
        }
      },

      upsertSlots: (s) => set((state) => {
        const normalized = upsertNormalized<SlotDomain>(state.slots, s as SlotDomain | SlotDomain[]);
        const sortedIds = Object.values(normalized.byId)
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          .map((x) => x.id);
        return { slots: normalized, upcomingIds: sortedIds };
      }),

      setSlot: (slot) => set((s) => ({ slots: upsertNormalized<SlotDomain>(s.slots, slot) })),

      updateSlotRemaining: (slotId, delta) => set((s) => {
        const existing = s.slots.byId[slotId];
        if (!existing) return {};
        const newRemaining = Math.max(0, (existing.remaining ?? 0) + delta);
        return { slots: adjustEntityNumeric(s.slots, slotId, { remaining: newRemaining } as any) };
      }),

      deactivateSlot: async (slotId) => {
        try {
          // optimistic
          set((s) => ({ slots: upsertNormalized<SlotDomain>(s.slots, { ...s.slots.byId[slotId], isActive: false } as SlotDomain) }));
          await api.post(`/slots/${slotId}/deactivate`);
        } catch (err) {
          // revert by refetching slots for center
          const centerId = get().centerId;
          if (centerId) await get().fetchSlots(centerId);
        }
      },

      getSlotById: (id) => get().slots.byId[id],

      /* -----------------------
         Bookings slice (optimistic flow)
         ----------------------- */

      fetchBookings: async (centerId, opts = {}) => {
        try {
          set((s) => ({ meta: { ...s.meta, loading: true, error: null } }));
          const q = new URLSearchParams();
          if (opts.date) q.set('date', opts.date);
          if (opts.page) q.set('page', String(opts.page));
          if (opts.pageSize) q.set('pageSize', String(opts.pageSize));
          const res = await api.get<{ items: BookingDomain[] }>(`/centers/${centerId}/bookings?${q.toString()}`);
          set((s) => ({ bookings: upsertNormalized<BookingDomain>(s.bookings, res.data.items), todaysIds: res.data.items.map((b) => b.id), meta: { ...s.meta, loading: false, lastFetchedAt: nowISO() } }));
        } catch (err) {
          set((s) => ({ meta: { ...s.meta, loading: false, error: extractErrorMessage(err as unknown) } }));
        }
      },

      createBookingOptimistic: (tempId, payload) => {
        const temp: BookingDomain = {
          id: tempId,
          slotId: payload.slotId,
          centerId: get().centerId || '',
          citizenId: payload.citizenId,
          status: 'Pending',
          bookedAt: nowISO(),
          createdAt: nowISO(),
          updatedAt: nowISO(),
        } as BookingDomain;
        set((s) => {
          const bookings = upsertNormalized<BookingDomain>(s.bookings, temp);
          const slots = adjustEntityNumeric(s.slots, payload.slotId, { remaining: Math.max(0, (s.slots.byId[payload.slotId]?.remaining ?? 0) - 1) } as any);
          return { bookings, slots, todaysIds: [tempId, ...s.todaysIds] };
        });
      },

      confirmBookingFromServer: (tempId, booking, updatedSlot) => {
        set((s) => {
          // remove temp and add real booking
          const byId = { ...s.bookings.byId };
          delete byId[tempId];
          byId[booking.id] = booking;
          const ids = s.bookings.ids.filter((id) => id !== tempId);
          if (!ids.includes(booking.id)) ids.unshift(booking.id);
          const bookings = { byId, ids };
          let slots = s.slots;
          if (updatedSlot) slots = upsertNormalized<SlotDomain>(s.slots, updatedSlot);
          return { bookings, slots, todaysIds: ids.filter((id) => ids.includes(id)) };
        });
      },

      replaceBooking: (booking) => set((s) => ({ bookings: upsertNormalized<BookingDomain>(s.bookings, booking) })),

      cancelBooking: async (bookingId) => {
        try {
          // optimistic mark cancelled
          set((s) => {
            const existing = s.bookings.byId[bookingId];
            if (!existing) return {};
            const updated = { ...existing, status: 'Cancelled', updatedAt: nowISO() } as BookingDomain;
            return { bookings: upsertNormalized<BookingDomain>(s.bookings, updated) };
          });
          await api.post(`/bookings/${bookingId}/cancel`);
        } catch (err) {
          // on error refetch bookings
          const centerId = get().centerId;
          if (centerId) await get().fetchBookings(centerId);
        }
      },

      revertOptimisticBooking: (tempId) => {
        set((s) => {
          const temp = s.bookings.byId[tempId];
          if (!temp) return {};
          const slotId = temp.slotId;
          const slots = adjustEntityNumeric(s.slots, slotId, { remaining: Math.min((s.slots.byId[slotId]?.capacity ?? Infinity), (s.slots.byId[slotId]?.remaining ?? 0) + 1) } as any);
          const bookings = removeFromNormalized<BookingDomain>(s.bookings, tempId);
          return { bookings, slots, todaysIds: s.todaysIds.filter((id) => id !== tempId) };
        });
      },

      getBookingsForSlot: (slotId) => Object.values(get().bookings.byId).filter((b) => b.slotId === slotId),

      /* -----------------------
         Stock slice
         ----------------------- */

      fetchStock: async (centerId) => {
        try {
          set((s) => ({ meta: { ...s.meta, loading: true, error: null } }));
          const res = await api.get(`/centers/${centerId}/stock`);
          set((s) => ({ items: upsertNormalized<VaccineStockItem>(s.items, res.data.items || res.data), movements: res.data.movements || s.movements, meta: { ...s.meta, loading: false, lastFetchedAt: nowISO() } }));
        } catch (err) {
          set((s) => ({ meta: { ...s.meta, loading: false, error: extractErrorMessage(err as unknown) } }));
        }
      },

      upsertStockItems: (items) => set((s) => ({ items: upsertNormalized<VaccineStockItem>(s.items, items) })),

      recordMovement: (m) => set((s) => ({ movements: [m, ...s.movements] })),

      getExpiringSoon: (withinDays) => {
        const cutoff = Date.now() + withinDays * 24 * 60 * 60 * 1000;
        return Object.values(get().items.byId).filter((it) => it.expiryDate && new Date(it.expiryDate).getTime() <= cutoff);
      },

      /* -----------------------
         Reminder slice
         ----------------------- */

      fetchReminders: async (centerId) => {
        try {
          set((s) => ({ meta: { ...s.meta, loading: true, error: null } }));
          const res = await api.get(`/centers/${centerId}/reminders`);
          set((s) => ({ reminders: upsertNormalized<Reminder>(s.reminders, res.data.items || res.data), meta: { ...s.meta, loading: false, lastFetchedAt: nowISO() } }));
        } catch (err) {
          set((s) => ({ meta: { ...s.meta, loading: false, error: extractErrorMessage(err as unknown) } }));
        }
      },

      sendReminderNow: async (reminderId) => {
        try {
          await api.post(`/reminders/${reminderId}/send`);
          set((s) => {
            const r = s.reminders.byId[reminderId];
            if (!r) return {};
            return { reminders: upsertNormalized<Reminder>(s.reminders, { ...r, status: 'SENT', sentAt: nowISO() } as Reminder) };
          });
        } catch (err) {
          set((s) => ({ meta: { ...s.meta, error: extractErrorMessage(err as unknown) } }));
        }
      },

      markSent: (reminderId, sentAt) => set((s) => {
        const r = s.reminders.byId[reminderId];
        if (!r) return {};
        return { reminders: upsertNormalized<Reminder>(s.reminders, { ...r, status: 'SENT', sentAt: sentAt || nowISO() } as Reminder) };
      }),

      getPendingReminders: () => Object.values(get().reminders.byId).filter((r) => r.status === 'SCHEDULED'),

      /* -----------------------
         Analytics slice
         ----------------------- */

      fetchAnalytics: async (centerId, opts = {}) => {
        try {
          set(() => ({ loading: true, error: null }));
          const q = new URLSearchParams();
          if (opts.from) q.set('from', opts.from);
          if (opts.to) q.set('to', opts.to);
          const res = await api.get(`/centers/${centerId}/analytics?${q.toString()}`);
          set(() => ({ bookingTrends: res.data.bookingTrends || [], mostBookedSlots: res.data.mostBookedSlots || [], loading: false }));
        } catch (err) {
          set(() => ({ loading: false, error: extractErrorMessage(err as unknown) }));
        }
      },

      setAnalytics: (payload) => set(() => ({ bookingTrends: payload.bookingTrends, mostBookedSlots: payload.mostBookedSlots })),

      exportCsv: (opts = {}) => {
        // simple CSV generator using bookingTrends
        const rows = (get().bookingTrends || []).map((r) => `${r.date},${r.count}`);
        const header = 'date,count';
        return [header, ...rows].join('\n');
      },
    }))
  )
);
