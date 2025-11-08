import { NextRequest, NextResponse } from "next/server";
import { UpdateStaffResponse, CreateStaffResponse, DeleteStaffResponse, UpdateStaffReq } from "@/types/shakib/staff.types";
import { getMockStore } from "@/utils/shakib/mock/staffStore";

// GET staff/:id
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const store = getMockStore();
    const entity = store.getById(id);
    if (!entity) return NextResponse.json({ ok: false, error: "Not found" } as CreateStaffResponse, { status: 404 });
    return NextResponse.json({ ok: true, data: entity } as CreateStaffResponse);
}

// PATCH staff/:id
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = (await request.json()) as Partial<UpdateStaffReq>;
    const store = getMockStore();

    const updated = store.update(id, body);
    if (!updated) return NextResponse.json({ ok: false, error: "Not found" } as UpdateStaffResponse, { status: 404 });

    return NextResponse.json({ ok: true, data: updated } as UpdateStaffResponse);
}

// DELETE staff/:id
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const store = getMockStore();
    const ok = store.delete(id);
    if (!ok) return NextResponse.json({ ok: false, error: "Not found" } as DeleteStaffResponse, { status: 404 });
    return NextResponse.json({ ok: true, deletedId: id } as DeleteStaffResponse);
}
