import { NextRequest, NextResponse } from "next/server";
import { CreateStaffReq, CreateStaffResponse } from "@/types/shakib/staff.types";
import { getMockStore } from "@/utils/shakib/mock/staffStore";

// GET -> list staff (paged & filter support)
// POST -> create staff
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? undefined;
    const role = url.searchParams.get("role") ?? undefined;
    const isActive = url.searchParams.has("isActive")
        ? url.searchParams.get("isActive") === "true"
        : undefined;
    const orderBy = url.searchParams.get("orderBy") ?? undefined;

    const store = await getMockStore();
    const all = store.all();

    let filtered = all;
    if (typeof isActive === "boolean") filtered = filtered.filter((s) => s.isActive === isActive);
    if (role) filtered = filtered.filter((s) => s.role === role);
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (s) => s.fullName.toLowerCase().includes(q) || (s.email ?? "").toLowerCase().includes(q)
        );
    }

    // Sort logic remains
    if (orderBy === "createdAt:desc") filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    if (orderBy === "createdAt:asc") filtered.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    if (orderBy === "name:asc") filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
    if (orderBy === "name:desc") filtered.sort((a, b) => b.fullName.localeCompare(a.fullName));

    return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
    const body = (await request.json()) as CreateStaffReq;
    const store = await getMockStore();

    // Basic validation (mirror types)
    if (!body.fullName) {
        return NextResponse.json({ ok: false, error: "fullName is required" } as CreateStaffResponse, { status: 400 });
    }

    const created = store.create({
        fullName: body.fullName,
        preferredName: body.preferredName ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        role: body.role,
        qualifications: body.qualifications ?? [],
        certifications: body.certifications ?? [],
        emergencyContact: body.emergencyContact ?? null,
        isActive: true,
        hireDate: body.hireDate ?? null,
        endDate: null,
        shifts: body.shifts ?? [],
        permissions: body.permissions ?? {},
        assignedDailyCapacity: body.assignedDailyCapacity ?? null,
        notes: body.notes ?? null,
    });

    const res: CreateStaffResponse = { ok: true, data: created };
    return NextResponse.json(res, { status: 201 });
}
