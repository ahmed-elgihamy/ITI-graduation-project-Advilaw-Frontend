import { PagedResponse } from './PagedResponse';

export interface ApiResponse<T> {
  data: T;
  // data: PagedResponse<T>;
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: any;
  meta: any;
}
