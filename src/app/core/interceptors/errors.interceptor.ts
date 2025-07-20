// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpErrorResponse,
//   HTTP_INTERCEPTORS,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable()
// export class ErrorsInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('HTTP Error:', error);
//         return throwError(() => error);
//       })
//     );
//   }
// }

// // 👇 لازم تعمل export ده علشان يكون Module
// export const errorsInterceptor = {
//   provide: HTTP_INTERCEPTORS,
//   useClass: ErrorsInterceptor,
//   multi: true,
// };
