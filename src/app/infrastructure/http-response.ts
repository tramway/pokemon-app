export interface HttpResponse<T = any> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
