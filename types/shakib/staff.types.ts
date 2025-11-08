// staff.types.ts
export type ID = string;
export type ISODateString = string;

export enum CenterStaffRole {
  Admin = 'ADMIN',
  Nurse = 'NURSE',
  Pharmacist = 'PHARMACIST',
  Reception = 'RECEPTION',
  Manager = 'MANAGER',
  Other = 'OTHER',
}

export interface StaffPermission {
  manageStaff?: boolean;
  manageAppointments?: boolean;
  manageStock?: boolean;
  sendReminders?: boolean;
  viewReports?: boolean;
  adjustCapacity?: boolean;
  [key: string]: boolean | undefined;
}

export interface StaffShift {
  dayOfWeek: number; // 0-6
  startHour: string; // "HH:mm"
  endHour: string; // "HH:mm"
  capacityOverride?: number | null;
}

export interface StaffDomain {
  id: ID;
  userId?: ID | null;
  employeeId?: string | null;
  fullName: string;
  preferredName?: string | null;
  email?: string | null;
  phone?: string | null;
  role: CenterStaffRole | string;
  qualifications?: string[];
  certifications?: string[];
  emergencyContact?: { name?: string; phone?: string; relation?: string } | null;
  isActive: boolean;
  hireDate?: ISODateString | null;
  endDate?: ISODateString | null;
  shifts?: StaffShift[];
  permissions?: StaffPermission;
  assignedDailyCapacity?: number | null;
  notes?: string | null;
  lastAppointmentHandledAt?: ISODateString | null;
  lastStockTransactionAt?: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  isDeleted?: boolean;
}

/* Presentation / UI-friendly types kept as-is */
export interface StaffCard {
  id: ID;
  fullName: string;
  displayName: string;
  initials?: string;
  avatarUrl?: string | null;
  role: CenterStaffRole | string;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  assignedDailyCapacity?: number | null;
  shiftsSummary?: string;
}

/* API request / response shapes */
export interface CreateStaffReq {
  employeeId?: string;
  fullName: string;
  preferredName?: string | null;
  email?: string | null;
  phone?: string | null;
  role: CenterStaffRole | string;
  qualifications?: string[];
  certifications?: string[];
  emergencyContact?: { name?: string; phone?: string; relation?: string } | null;
  hireDate?: ISODateString | null;
  assignedDailyCapacity?: number | null;
  shifts?: StaffShift[];
  permissions?: StaffPermission;
  notes?: string | null;
}

export interface UpdateStaffReq {
  id: ID;
  employeeId?: string | null;
  fullName?: string;
  preferredName?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: CenterStaffRole | string;
  qualifications?: string[] | null;
  certifications?: string[] | null;
  emergencyContact?: { name?: string; phone?: string; relation?: string } | null;
  isActive?: boolean;
  hireDate?: ISODateString | null;
  endDate?: ISODateString | null;
  assignedDailyCapacity?: number | null;
  shifts?: StaffShift[] | null;
  permissions?: StaffPermission | null;
  notes?: string | null;
}

/* Removed pagination/list-query types and item-summary types */

/* Single resource responses */
export interface StaffResponse {
  ok: boolean;
  data?: StaffDomain;
  error?: string;
}

export interface CreateStaffResponse {
  ok: boolean;
  data?: StaffDomain;
  error?: string;
}

export interface UpdateStaffResponse {
  ok: boolean;
  data?: StaffDomain;
  error?: string;
}

export interface DeleteStaffResponse {
  ok: boolean;
  deletedId?: ID;
  error?: string;
}

/* Validation / form result shapes */
export interface StaffFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  employeeId?: string;
  assignedDailyCapacity?: string;
  shifts?: string;
  permissions?: string;
  [key: string]: string | undefined;
}

/* Zustand store slice types */
export interface Normalized<T> {
  byId: Record<ID, T>;
  ids: ID[];
}

export interface EntityMeta {
  loading: boolean;
  error?: string | null;
  lastFetchedAt?: ISODateString | null;
  initialized?: boolean;
  stale?: boolean;
}

export type StoreActionResult = Promise<void>;

export interface StaffSlice {
  staff: Normalized<StaffDomain>;
  meta: EntityMeta;

  // CRUD
  fetchAllStaff: () => StoreActionResult; // fetch all staff once
  fetchStaffById: (id: ID) => StoreActionResult;
  createStaff: (payload: CreateStaffReq) => StoreActionResult;
  updateStaff: (payload: UpdateStaffReq) => StoreActionResult;
  removeStaff: (id: ID) => StoreActionResult;

  // Local helpers
  upsertStaff: (items: StaffDomain | StaffDomain[]) => void;
  bulkUpsertStaff: (items: StaffDomain[]) => void;
  setStaffActive: (id: ID, active: boolean) => void;
  getStaffArray: () => StaffDomain[];
  getActiveStaffCount: () => number;
  getOnDutyCountForDate: (dateISO: ISODateString) => number;

  // assignment
  assignStaffToSlot: (staffId: ID, slotId: ID) => StoreActionResult;
  unassignStaffFromSlot: (staffId: ID, slotId: ID) => StoreActionResult;
}

/* UI component prop changes: accept full arrays instead of paginated summaries */
export interface StaffListProps {
  items: StaffDomain[]; // now full StaffDomain[]
  loading?: boolean;
  onEdit: (id: ID) => void;
  onDelete: (id: ID) => Promise<void> | void;
  onToggleActive: (id: ID, active: boolean) => Promise<void> | void;
  onCreate?: () => void;
}

export interface StaffFormProps {
  initial?: Partial<StaffDomain> | null;
  onCancel?: () => void;
  onSave: (payload: CreateStaffReq | UpdateStaffReq) => Promise<void> | void;
  submitting?: boolean;
  errors?: StaffFormErrors;
}

export interface StaffCardProps {
  staff: StaffCard;
  compact?: boolean;
  onAssign?: (staffId: ID, slotId: ID) => Promise<void>;
  onEdit?: (id: ID) => void;
  onToggleActive?: (id: ID, active: boolean) => Promise<void>;
}

/* Minimal server-side admin payloads */
export interface AssignStaffToSlotReq {
  staffId: ID;
  slotId: ID;
  assignedBy: ID;
  note?: string | null;
}

export interface AssignStaffToSlotResp {
  ok: boolean;
  data?: { staffId: ID; slotId: ID; assignedAt: ISODateString };
  error?: string;
}
