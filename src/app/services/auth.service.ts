import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { APP_USERS } from '../shared/constants';
import { collection, doc, Firestore, getDoc, getFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth,
    private router: Router,
    private httpClient: HttpClient,
  ) {
    this._firestore = getFirestore();
    this.loadUserDataFromLocalStorage();
  }
  public _firestore: Firestore;

  userData: any = null;

  private loadUserDataFromLocalStorage(): void {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData = JSON.parse(storedData);
    }
  }

  get userRole(): string | null {
    return this.userData?.userData.rol;

  }


  login(payload: any): Observable<any> {

    const request = {
      origin: "Postman",
      usrRequest: "veagro",
      payload
    }
    return this.httpClient.post(environment.urlMsVeagro + "/auth/login", request);
  }


  isAuthenticated(): boolean {
    // Lógica para determinar si el usuario está autenticado
    return !!localStorage.getItem('token'); // Ejemplo de verificación
  }

  logout(): void {
    // Eliminar el token de localStorage (si lo tienes almacenado)
    localStorage.removeItem('token');

    // Eliminar los datos del usuario (userData) de localStorage

    // Si estás utilizando Firebase, cerrar sesión en Firebase
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Sesión cerrada en Firebase');

        // Redirigir al usuario al login
        this.router.navigate(['/login']).then(() => {
          // Recargar la página después de redirigir
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error('Error al cerrar sesión en Firebase:', error);
      });
  }


  saveToken(token: string) {
    localStorage.setItem('token', token);

  }
}
