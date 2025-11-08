// overview.types.ts
// Zustand-ready type definitions for the Center Dashboard Overview
// (Original domain DTOs kept; store-related types extended for hydration, reset, and improved meta.)

/* Common primitives and enums */

export type ID = string;

export type ISODateString = string;

export type Nullable<T> = T | null;

export enum Gender { Male = 'male', Female = 'female', Other = 'other' }

export enum SlotType { OneTime = 'ONE_TIME', Recurring = 'RECURRING' }

export enum BookingStatus { Pending = 'PENDING', Confirmed = 'CONFIRMED', CheckedIn = 'CHECKED_IN', Cancelled = 'CANCELLED', NoShow = 'NO_SHOW' }

export enum ReminderChannel { Sms = 'SMS', Email = 'EMAIL' }

export enum MovementType { Receive = 'RECEIVE', TransferOut = 'TRANSFER_OUT', TransferIn = 'TRANSFER_IN', Waste = 'WASTE', Adjustment = 'ADJUSTMENT' }

/* Domain DTOs (unchanged) */

export interface CenterDTO {
  id: ID;
  centerName: string;
  licenseNumber?: string | null;
  address: {
    division?: string;
    district: string;
    upazila?: string | null;
    detail?: string | null;
  };
  contactPhone?: string | null;
  geo?: { type: 'Point'; coordinates: [number, number] } | null;
  capacityPerSlot?: number | null;
  vaccineTypes?: string[];
  status: string;
  isVerified: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  timezone?: string | null;
}

export interface StaffShift {
  dayOfWeek: number;
  startHour: string;
  endHour: string;
  capacityOverride?: number | null;
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

export interface StaffDomain {
  id: ID;
  userId?: ID | null;
  centerId: ID;
  employeeId?: string | null;
  fullName: string;
  preferredName?: string | null;
  email?: string | null;
  phone?: string | null;
  role: string;
  qualifications?: string[];
  certifications?: string[];
  isActive: boolean;
  hireDate?: ISODateString | null;
  endDate?: ISODateString | null;
  assignedDailyCapacity?: number | null;
  shifts?: StaffShift[];
  permissions?: StaffPermission;
  lastAppointmentHandledAt?: ISODateString | null;
  lastStockTransactionAt?: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface StaffCard {
  id: ID;
  fullName: string;
  displayName: string;
  initials?: string;
  avatarUrl?: string | null;
  role: string;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  assignedDailyCapacity?: number | null;
  shiftsSummary?: string;
}

export interface RecurringRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  interval?: number;
  byWeekDay?: number[];
  until?: ISODateString | null;
}

export interface SlotDomain {
  id: ID;
  centerId: ID;
  slotType: SlotType;
  startTime: ISODateString;
  endTime: ISODateString;
  capacity: number;
  remaining: number;
  vaccineType?: string | null;
  doseNumber: number;
  recurringRule?: RecurringRule | null;
  isActive: boolean;
  createdBy: ID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  timezone?: string | null;
}

export interface BookingDomain {
  id: ID;
  slotId: ID;
  centerId: ID;
  citizenId: ID;
  status: BookingStatus;
  bookedAt: ISODateString;
  expiresAt?: ISODateString | null;
  checkInAt?: ISODateString | null;
  doseNumber?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface VaccineStockItem {
  id: ID;
  centerId: ID;
  vaccineName: string;
  lotNumber?: string | null;
  manufacturer?: string | null;
  expiryDate?: ISODateString | null;
  totalReceived: number;
  totalUsed: number;
  totalWasted: number;
  remaining: number;
  storageTemperature?: string | null;
  coldChainGuidelineRef?: string | null;
  lastUpdatedAt: ISODateString;
  createdAt: ISODateString;
}

export interface StockMovement {
  id: ID;
  centerId: ID;
  vaccineStockItemId?: ID | null;
  type: MovementType;
  quantity: number;
  sourceHubId?: ID | null;
  destinationCenterId?: ID | null;
  reason?: string | null;
  recordedBy: ID;
  recordedAt: ISODateString;
  notes?: string | null;
}

export interface Reminder {
  id: ID;
  centerId: ID;
  bookingId?: ID | null;
  citizenId?: ID | null;
  channels: ReminderChannel[];
  scheduledAt: ISODateString;
  sentAt?: ISODateString | null;
  status: 'SCHEDULED' | 'SENT' | 'FAILED';
  attemptCount: number;
  lastError?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CenterMetrics {
  centerId: ID;
  timestamp: ISODateString;
  activeStaffCount: number;
  onDutyStaffCount: number;
  todaysBookings: number;
  todaysCheckIns: number;
  todaysCancellations: number;
  availableSlotsCount: number;
  totalRemainingDoses: number;
  nextSlotAt?: ISODateString | null;
  utilizationPercent?: number;
}

export interface AuditEntry {
  id: ID;
  actorId?: ID | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  detail?: string | null;
  createdAt: ISODateString;
}

/* Composite Overview DTO */

export interface CenterOverviewApiDTO {
  center: CenterDTO;
  metrics: CenterMetrics;
  staff: StaffDomain[];
  upcomingSlots: { slot: SlotDomain; availableSeats: number; bookedCount: number }[];
  todaysBookings: { booking: BookingDomain; citizenDisplay?: { id: ID; fullName: string; phone?: string | null }; slot?: SlotDomain | null }[];
  stockSummary: VaccineStockItem[];
  recentStockMovements: StockMovement[];
  pendingReminders: Reminder[];
  recentAudits: AuditEntry[];
}

/* API shapes */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/* Booking create/response and conflict */

export interface CreateBookingReq {
  slotId: ID;
  citizenId: ID;
  requestedAt?: ISODateString;
  timezone?: string;
}

export interface CreateBookingSuccess {
  booking: BookingDomain;
  updatedSlot?: SlotDomain;
}

export type CreateBookingResponse = ApiResponse<CreateBookingSuccess>;

export type ConflictReason = 'OVERBOOKED' | 'SLOT_EXPIRED' | 'TIME_CONFLICT' | 'DOUBLE_BOOKING' | string;

export interface ConflictPayload {
  conflictReason: ConflictReason;
  suggestedAlternatives?: { slotId: ID; startTime: ISODateString; endTime: ISODateString; availableSeats: number }[];
  serverSlot?: SlotDomain;
}

/* Stock adjust */

export interface AdjustStockReq {
  vaccineStockItemId?: ID;
  centerId: ID;
  type: MovementType | string;
  quantity: number;
  reason?: string;
  recordedBy: ID;
}

export interface AdjustStockResponse {
  ok: true;
  updatedItem?: VaccineStockItem;
  movement?: StockMovement;
}

/* Normalized helpers and meta */

export interface Normalized<T> {
  byId: Record<ID, T>;
  ids: ID[];
}

export interface EntityMeta {
  loading: boolean;
  error?: string | null;
  lastFetchedAt?: ISODateString | null;
  // additional fields useful in state management patterns
  initialized?: boolean; // whether initial fetch completed
  stale?: boolean; // whether data is stale and needs refresh
}

/* Small utility types for store async actions */

export type StoreActionResult = Promise<void>;

/* Zustand store slices (updated for zustand usage) */

/**
 * CenterSlice
 * - meta: status for center read
 * - fetch/set/clear actions
 */
export interface CenterSlice {
  centerId?: ID | null;
  center?: CenterDTO | null;
  meta: EntityMeta;

  fetchCenter: (centerId: ID, opts?: { force?: boolean }) => StoreActionResult;
  setCenter: (c: CenterDTO) => void;
  clearCenter: () => void;
}

/**
 * MetricsSlice
 */
export interface MetricsSlice {
  metrics?: CenterMetrics | null;
  meta: EntityMeta;

  refreshMetrics: (centerId: ID) => StoreActionResult;
  setMetrics: (m: CenterMetrics) => void;
}

/**
 * StaffSlice
 */
export interface StaffSlice {
  staff: Normalized<StaffDomain>;
  meta: EntityMeta;

  fetchStaff: (centerId: ID, opts?: { page?: number; pageSize?: number }) => StoreActionResult;
  upsertStaff: (items: StaffDomain | StaffDomain[]) => void;
  removeStaff: (id: ID) => void;
  getStaffArray: () => StaffDomain[];
  getOnDutyStaffCountForDate: (dateISO: ISODateString) => number;
  assignStaffToSlot: (staffId: ID, slotId: ID) => StoreActionResult;
}

/**
 * SlotsSlice
 */
export interface SlotsSlice {
  slots: Normalized<SlotDomain>;
  upcomingIds: ID[]; // sorted ascending by startTime
  meta: EntityMeta;

  fetchSlots: (centerId: ID, opts?: { from?: ISODateString; to?: ISODateString; page?: number; pageSize?: number }) => StoreActionResult;
  upsertSlots: (s: SlotDomain | SlotDomain[]) => void;
  setSlot: (slot: SlotDomain) => void;
  updateSlotRemaining: (slotId: ID, delta: number) => void; // atomic optimistic adjust
  deactivateSlot: (slotId: ID) => StoreActionResult;
  getSlotById: (id: ID) => SlotDomain | undefined;
}

/**
 * BookingsSlice
 */
export interface BookingsSlice {
  bookings: Normalized<BookingDomain>;
  todaysIds: ID[]; // booking ids for today
  meta: EntityMeta;

  fetchBookings: (centerId: ID, opts?: { date?: ISODateString; page?: number; pageSize?: number }) => StoreActionResult;
  createBookingOptimistic: (tempId: ID, payload: Partial<BookingDomain> & { slotId: ID; citizenId: ID }) => void;
  confirmBookingFromServer: (tempId: ID, booking: BookingDomain, updatedSlot?: SlotDomain) => void;
  replaceBooking: (booking: BookingDomain) => void;
  cancelBooking: (bookingId: ID) => StoreActionResult;
  revertOptimisticBooking: (tempId: ID) => void;
  getBookingsForSlot: (slotId: ID) => BookingDomain[];
}

/**
 * StockSlice
 */
export interface StockSlice {
  items: Normalized<VaccineStockItem>;
  movements: StockMovement[];
  meta: EntityMeta;

  fetchStock: (centerId: ID) => StoreActionResult;
  upsertStockItems: (items: VaccineStockItem[]) => void;
  recordMovement: (m: StockMovement) => void;
  getExpiringSoon: (withinDays: number) => VaccineStockItem[];
}

/**
 * ReminderSlice
 */
export interface ReminderSlice {
  reminders: Normalized<Reminder>;
  meta: EntityMeta;

  fetchReminders: (centerId: ID) => StoreActionResult;
  sendReminderNow: (reminderId: ID) => StoreActionResult;
  markSent: (reminderId: ID, sentAt?: ISODateString) => void;
  getPendingReminders: () => Reminder[];
}

/**
 * AnalyticsSlice
 */
export interface AnalyticsSlice {
  bookingTrends?: { date: ISODateString; count: number }[];
  mostBookedSlots?: { slotId: ID; count: number }[];
  loading: boolean;
  error?: string | null;

  fetchAnalytics: (centerId: ID, opts?: { from?: ISODateString; to?: ISODateString }) => StoreActionResult;
  setAnalytics: (payload: { bookingTrends?: { date: ISODateString; count: number }[]; mostBookedSlots?: { slotId: ID; count: number }[] }) => void;
  exportCsv: (opts?: { from?: ISODateString; to?: ISODateString; format?: 'csv' | 'json' }) => string;
}

/* Additional store-level helpers for Zustand integration */

/**
 * hydrateFromOverview
 * - Accepts full landing payload (SSR) and seeds store
 * resetStore
 * - Clears store back to initial shape (useful on sign-out or switching center)
 *
 * hydrated flag exposes whether client-side rehydration has already occurred
 */
export type DashboardStoreBaseActions = {
  hydrateFromOverview: (overview: CenterOverviewApiDTO) => void;
  resetStore: () => void;
  hydrated: boolean;
};

/* Combined DashboardStore type */

export type DashboardStore = DashboardStoreBaseActions
  & CenterSlice
  & MetricsSlice
  & StaffSlice
  & SlotsSlice
  & BookingsSlice
  & StockSlice
  & ReminderSlice
  & AnalyticsSlice;

/* UI component props (unchanged) */

export interface DashboardPageProps {
  initialOverview?: CenterOverviewApiDTO | null;
  centerId: ID;
  userTimezone?: string;
}

export interface CenterHeaderProps {
  center: CenterDTO;
  metrics?: CenterMetrics | null;
  tz: string;
  onRefresh?: () => Promise<void> | void;
}

export interface StaffCardProps {
  staff: StaffCard;
  onAssign?: (staffId: ID, slotId: ID) => Promise<void>;
  compact?: boolean;
}

export interface SlotListProps {
  slots: SlotDomain[];
  timezone: string;
  onBook: (slotId: ID) => Promise<void>;
  onEdit?: (slot: SlotDomain) => Promise<void> | void;
  onDelete?: (slotId: ID) => Promise<void> | void;
}

export interface BookingRowProps {
  booking: BookingDomain;
  citizen?: { id: ID; fullName: string; phone?: string | null };
  timezone: string;
  onCancel?: (id: ID) => Promise<void>;
  onCheckIn?: (id: ID) => Promise<void>;
}

/* Selectors, optimistic types and helpers */

export type SlotSelector = (slot: SlotDomain) => boolean;
export type BookingSelector = (b: BookingDomain) => boolean;

export interface OptimisticBooking {
  tempId: ID;
  slotId: ID;
  citizenId: ID;
  requestedAt: ISODateString;
  status: 'PENDING' | 'ROLLBACK';
  createdAt: ISODateString;
}

export interface ConflictResponse {
  conflictReason: ConflictReason;
  suggestedAlternatives?: { slotId: ID; startTime: ISODateString; endTime: ISODateString; availableSeats: number }[];
  serverSlot?: SlotDomain;
}

/* Utilities and formatting */

export interface TimezoneRenderOptions {
  tz: string;
  showLocalOffset?: boolean;
  format?: string;
}

/* Minimal helper signatures (implementation-free) */

export type UpsertFn<T> = (state: Normalized<T>, incoming: T | T[]) => Normalized<T>;
export type RemoveFn = (stateIds: ID[], idToRemove: ID) => ID[];
