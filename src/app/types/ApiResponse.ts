import { PagedResponse } from './PagedResponse';

export interface ApiResponse<T> {
  data: PagedResponse<T>;
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: any;
  meta: any;
}
