export type Nullable<T> = T | null;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export type SortDirection = 'asc' | 'desc';

export interface SortParams<T> {
  field: keyof T;
  direction: SortDirection;
}