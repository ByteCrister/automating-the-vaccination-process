import { NextRequest, NextResponse } from "next/server";
import {
  AssignStaffToSlotReq,
  AssignStaffToSlotResp,
} from "@/types/shakib/staff.types";
import { getMockStore } from "@/utils/shakib/mock/staffStore";

// POST -> create assignment
export async function POST(
  request: NextRequest,
  { params }: { params: { centerId: string } }
) {
  const centerId = params.centerId;
  const body = (await request.json()) as AssignStaffToSlotReq;

  // basic validation
  if (!body.staffId || !body.slotId) {
    return NextResponse.json(
      {
        ok: false,
        error: "staffId and slotId are required",
      } as AssignStaffToSlotResp,
      { status: 400 }
    );
  }

  // simple simulated assignment: record assignment timestamp in mock store
  const store = await getMockStore();
  const success = store.assignToSlot(centerId, body.staffId);
  if (!success)
    return NextResponse.json(
      {
        ok: false,
        error: "staff not found or center mismatch",
      } as AssignStaffToSlotResp,
      { status: 404 }
    );

  return NextResponse.json({
    ok: true,
    data: {
      staffId: body.staffId,
      slotId: body.slotId,
      assignedAt: new Date().toISOString(),
    },
  } as AssignStaffToSlotResp);
}

// DELETE -> remove assignment (expects JSON body with staffId & slotId)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { centerId: string } }
) {
  const centerId = params.centerId;
  const body = (await request.json()) as { staffId: string; slotId: string };
  if (!body?.staffId || !body?.slotId) {
    return NextResponse.json(
      {
        ok: false,
        error: "staffId and slotId are required",
      } as AssignStaffToSlotResp,
      { status: 400 }
    );
  }
  const store = await getMockStore();
  const ok = store.unassignFromSlot(centerId, body.staffId);
  if (!ok)
    return NextResponse.json(
      { ok: false, error: "not found" } as AssignStaffToSlotResp,
      { status: 404 }
    );
  return NextResponse.json({ ok: true } as AssignStaffToSlotResp);
}
