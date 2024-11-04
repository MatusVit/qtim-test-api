export interface IPagination<T> {
  total: number;
  page: number;
  data: T[];
}
