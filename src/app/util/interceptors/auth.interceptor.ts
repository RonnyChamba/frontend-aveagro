import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
// import { NotificationService } from '../services';
import { AuthService, UserService } from '../../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

   // Clonar la solicitud para agregar el token de autenticación si está disponible
   const authReq = token
   ? req.clone({
       setHeaders: {
         Authorization: `Bearer ${token}`,
       },
     })
   : req;

  return next(authReq).pipe(
    catchError((error) => {
      console.log(token),
      console.error('Error:', error);

      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');
        router.navigate(['/login']);

        return throwError(() => new Error(error.error?.message || 'Sesión inválida'));
      }

      return throwError(() => error);
    }),
  );
};
