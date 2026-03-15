import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = (error.error && typeof error.error === 'object' && 'error' in error.error)
        ? String(error.error.error)
        : 'Something went wrong';

      if (error.status === 401) {
        auth.logout();
        toast.show(message, 'error');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
