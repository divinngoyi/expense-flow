import { useAuth } from "@/components/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export type TransactionType = "MoneyIn" | "MoneyOut";
export type TransactionStatus = "Confirmed" | "Pending" | "Skipped";
export type CategoryType = "MoneyIn" | "MoneyOut" | "Both";
export type SourceType = "Bank" | "Cash" | "DigitalWallet";

export interface AppUserDto {
  id: string;
  externalAuthUserId: string;
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface TransactionDto {
  id: string;
  transactionType: TransactionType;
  amount: number;
  description?: string;
  transactionDate: string;
  entrySource: string;
  transactionStatus: TransactionStatus;
  categoryId?: string;
  categoryName?: string;
  transactionSourceId: string;
  transactionSourceName: string;
  transactionSourceType: SourceType;
  createdAt: string;
}

export interface CreateTransactionRequest {
  transactionType: TransactionType;
  amount: number;
  description?: string;
  transactionDate?: string;
  transactionStatus: TransactionStatus;
  categoryId?: string;
  transactionSourceId: string;
}

export interface UpdateTransactionRequest {
  transactionType?: TransactionType;
  amount?: number;
  description?: string;
  transactionDate?: string;
  transactionStatus?: TransactionStatus;
  categoryId?: string;
  transactionSourceId?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  categoryType: CategoryType;
  description?: string;
  isSystemDefault: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  categoryType: CategoryType;
  description?: string;
}

export interface TransactionSourceDto {
  id: string;
  sourceType: SourceType;
  name: string;
  isDefault: boolean;
  isArchived: boolean;
}

export interface DashboardSummaryDto {
  totalMoneyIn: number;
  totalMoneyOut: number;
  netFlow: number;
  moneyInChangePercent?: number;
  moneyOutChangePercent?: number;
  netFlowVsLastMonth?: number;
  year: number;
  month: number;
}

export interface CategoryBreakdownItemDto {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
}

export interface SourceBreakdownItemDto {
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  moneyIn: number;
  moneyOut: number;
}

export interface CalendarDayTotalDto {
  date: string;
  moneyIn: number;
  moneyOut: number;
  net: number;
  transactionCount: number;
}

export interface CalendarMonthDto {
  year: number;
  month: number;
  days: CalendarDayTotalDto[];
}

export interface CalendarDayDetailDto {
  date: string;
  transactions: TransactionDto[];
  totalMoneyIn: number;
  totalMoneyOut: number;
}

const GET_CACHE_TTL_MS = 30_000;

type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<unknown>>();
const cacheVersions = new Map<string, number>();

function invalidateUserCache(userId: string) {
  cacheVersions.set(userId, (cacheVersions.get(userId) ?? 0) + 1);
  const prefix = `${userId}:`;

  for (const key of responseCache.keys()) {
    if (key.startsWith(prefix)) responseCache.delete(key);
  }
}

async function performApiRequest<T>(
  token: string,
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

async function fetchApi<T>(
  token: string,
  userId: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const method = (options?.method ?? "GET").toUpperCase();

  if (method !== "GET") {
    const result = await performApiRequest<T>(token, path, options);
    invalidateUserCache(userId);
    return result;
  }

  const cacheKey = `${userId}:${path}`;
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }
  responseCache.delete(cacheKey);

  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) return inFlight as Promise<T>;

  const cacheVersion = cacheVersions.get(userId) ?? 0;
  const request = performApiRequest<T>(token, path, options)
    .then((value) => {
      if ((cacheVersions.get(userId) ?? 0) === cacheVersion) {
        responseCache.set(cacheKey, {
          expiresAt: Date.now() + GET_CACHE_TTL_MS,
          value,
        });
      }
      return value;
    })
    .finally(() => inFlightRequests.delete(cacheKey));

  inFlightRequests.set(cacheKey, request);
  return request;
}

// ── Hook-based client (use inside React components) ──────────────────────────
export function useApi() {
  const { user, getAccessToken } = useAuth();

  async function call<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await getAccessToken();
    if (!token || !user) throw new Error("Not authenticated");
    return fetchApi<T>(token, user.id, path, options);
  }

  const currentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  return {
    // Users
    syncUser: (email: string, displayName?: string) =>
      call<AppUserDto>("/api/users/sync", {
        method: "POST",
        body: JSON.stringify({ externalAuthUserId: "", email, displayName }),
      }),
    getMe: () => call<AppUserDto>("/api/users/me"),

    // Transactions
    getTransactions: (month?: string) =>
      call<TransactionDto[]>(`/api/transactions?month=${month ?? currentMonth()}`),
    createTransaction: (req: CreateTransactionRequest) =>
      call<TransactionDto>("/api/transactions", { method: "POST", body: JSON.stringify(req) }),
    updateTransaction: (id: string, req: UpdateTransactionRequest) =>
      call<TransactionDto>(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(req) }),
    deleteTransaction: (id: string) =>
      call<void>(`/api/transactions/${id}`, { method: "DELETE" }),
    confirmTransaction: (id: string) =>
      call<TransactionDto>(`/api/transactions/${id}/confirm`, { method: "PUT" }),
    skipTransaction: (id: string) =>
      call<TransactionDto>(`/api/transactions/${id}/skip`, { method: "PUT" }),

    // Categories
    getCategories: () => call<CategoryDto[]>("/api/categories"),
    createCategory: (req: CreateCategoryRequest) =>
      call<CategoryDto>("/api/categories", { method: "POST", body: JSON.stringify(req) }),
    updateCategory: (id: string, req: Partial<CreateCategoryRequest> & { isArchived?: boolean }) =>
      call<CategoryDto>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(req) }),
    deleteCategory: (id: string) =>
      call<void>(`/api/categories/${id}`, { method: "DELETE" }),

    // Sources
    getSources: () => call<TransactionSourceDto[]>("/api/transaction-sources"),

    // Dashboard
    getDashboardSummary: (month?: string) =>
      call<DashboardSummaryDto>(`/api/dashboard/summary?month=${month ?? currentMonth()}`),
    getCategoryBreakdown: (month?: string) =>
      call<CategoryBreakdownItemDto[]>(`/api/dashboard/category-breakdown?month=${month ?? currentMonth()}`),
    getSourceBreakdown: (month?: string) =>
      call<SourceBreakdownItemDto[]>(`/api/dashboard/source-breakdown?month=${month ?? currentMonth()}`),

    // Calendar
    getCalendarMonth: (month?: string) =>
      call<CalendarMonthDto>(`/api/calendar/month?month=${month ?? currentMonth()}`),
    getCalendarDay: (date: string) =>
      call<CalendarDayDetailDto>(`/api/calendar/day?date=${date}`),
  };
}
