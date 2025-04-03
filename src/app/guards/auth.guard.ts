import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { EMPTY } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return EMPTY; // Evita que la navegación continúe
  }

  return true;
};

function isTokenValid(token: string): boolean {
  const payload = decodeJwt(token);
  if (payload?.exp) {
    return payload.exp * 1000 > Date.now(); // Comparar con la fecha actual
  }
  return false;
}

function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}
