import { PagedResponse } from './PagedResponse';

export interface ApiResponse<T> {
  data: T;
  // data: PagedResponse<T>;
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors: string[];
  meta: any;
}


export interface BackendResponse<T> {
  data: T;
  succeeded: boolean;
  message: string;
  errors: string[];
}
