"use server";

import { faker } from "@faker-js/faker";
import type { StaffDomain, ID, StaffShift } from "@/types/shakib/staff.types";

/**
 * Global in-memory mock store (server-only)
 * Safe for Next.js App Router (Next.js 15+)
 * Used by server route handlers or server actions.
 */
type Internal = {
  byId: Record<ID, StaffDomain>;
  ids: ID[];
  assignments: Record<
    string,
    { staffId: ID; slotId: ID; assignedAt: string }[]
  >;
};

let store: Internal | null = null;

function makeId() {
  return faker.string.uuid();
}

function nowISO() {
  return new Date().toISOString();
}

function sampleShifts(): StaffShift[] {
  const day = faker.number.int({ min: 1, max: 5 });
  return [
    {
      dayOfWeek: day,
      startHour: "09:00",
      endHour: "17:00",
      capacityOverride: null,
    },
  ];
}

function randomPhone(): string {
  const suffix = faker.number
    .int({ min: 100000000, max: 999999999 })
    .toString();
  return `+8801${suffix.slice(1, 10)}`;
}

function seed(): Internal {
  const s: Internal = { byId: {}, ids: [], assignments: {} };

  for (let i = 0; i < 24; i++) {
    const id = makeId();
    const fullName = faker.person.fullName();
    s.byId[id] = {
      id,
      userId: faker.string.uuid(),
      employeeId: faker.number.int({ min: 1000, max: 9999 }).toString(),
      fullName,
      preferredName: Math.random() > 0.6 ? faker.person.firstName() : null,
      email: Math.random() > 0.2 ? faker.internet.email() : null,
      phone: Math.random() > 0.2 ? randomPhone() : null,
      role: faker.helpers.arrayElement([
        "NURSE",
        "RECEPTION",
        "PHARMACIST",
        "ADMIN",
        "MANAGER",
      ]),
      qualifications: [],
      certifications: [],
      emergencyContact: null,
      isActive: Math.random() > 0.1,
      hireDate: faker.date.past({ years: 3 }).toISOString(),
      endDate: null,
      shifts: sampleShifts(),
      permissions: {},
      assignedDailyCapacity: faker.number.int({ min: 4, max: 12 }),
      notes: null,
      lastAppointmentHandledAt: null,
      lastStockTransactionAt: null,
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: nowISO(),
      isDeleted: false,
    };
    s.ids.push(id);
  }

  return s;
}

export async function getMockStore() {
  if (!store) store = seed();

  return {
    all: () => Object.values(store!.byId),

    getById: (id: string) =>
      store!.byId[id] && !store!.byId[id].isDeleted ? store!.byId[id] : null,

    create: (partial: Partial<StaffDomain>) => {
      const id = makeId();
      const created: StaffDomain = {
        id,
        userId: faker.string.uuid(),
        employeeId:
          partial.employeeId ??
          faker.number.int({ min: 1000, max: 9999 }).toString(),
        fullName: partial.fullName ?? faker.person.fullName(),
        preferredName: partial.preferredName ?? null,
        email: partial.email ?? null,
        phone: partial.phone ?? null,
        role: partial.role ?? "OTHER",
        qualifications: partial.qualifications ?? [],
        certifications: partial.certifications ?? [],
        emergencyContact: partial.emergencyContact ?? null,
        isActive: partial.isActive ?? true,
        hireDate: partial.hireDate ?? nowISO(),
        endDate: partial.endDate ?? null,
        shifts: partial.shifts ?? [],
        permissions: partial.permissions ?? {},
        assignedDailyCapacity: partial.assignedDailyCapacity ?? null,
        notes: partial.notes ?? null,
        lastAppointmentHandledAt: null,
        lastStockTransactionAt: null,
        createdAt: nowISO(),
        updatedAt: nowISO(),
        isDeleted: false,
      };
      store!.byId[id] = created;
      store!.ids.push(id);
      return created;
    },

    update: (id: string, patch: Partial<StaffDomain>) => {
      const cur = store!.byId[id];
      if (!cur || cur.isDeleted) return null;
      const merged = { ...cur, ...patch, updatedAt: nowISO() };
      store!.byId[id] = merged;
      return merged;
    },

    delete: (id: string) => {
      const cur = store!.byId[id];
      if (!cur || cur.isDeleted) return false;
      cur.isDeleted = true;
      cur.isActive = false;
      cur.updatedAt = nowISO();
      store!.ids = store!.ids.filter((x) => x !== id);
      return true;
    },

    assignToSlot: (staffId: string, slotId: string) => {
      const s = store!.byId[staffId];
      if (!s || s.isDeleted) return false;
      const arr =
        store!.assignments[staffId] ?? (store!.assignments[staffId] = []);
      arr.push({ staffId, slotId, assignedAt: nowISO() });
      s.updatedAt = nowISO();
      store!.byId[staffId] = s;
      return true;
    },

    unassignFromSlot: (staffId: string, slotId: string) => {
      const arr = store!.assignments[staffId];
      if (!arr) return false;
      const before = arr.length;
      store!.assignments[staffId] = arr.filter((a) => a.slotId !== slotId);
      return store!.assignments[staffId].length < before;
    },
  };
}
