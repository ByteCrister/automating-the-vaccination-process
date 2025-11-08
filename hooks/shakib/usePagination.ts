import { useMemo } from "react";

export type UsePaginationResult<T> = {
  paginated: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function usePagination<T>(items: T[], page: number, pageSize: number): UsePaginationResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const normalizedPage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(() => {
    const start = (normalizedPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, normalizedPage, pageSize]);

  return { paginated, total, page: normalizedPage, pageSize, totalPages };
}

export default usePagination;
