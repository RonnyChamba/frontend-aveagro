import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceAlert {

  constructor() { }

   public loadingConMensaje(activo: boolean, mensaje?: string) {
    if (activo) {
      Swal.fire({
        title: 'Espere',
        text: mensaje ? mensaje : 'Procesando Información',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      Swal.showLoading();
    } else {
      Swal.close();
    }
  }

   public mensajeErrorTitulo(titulo: string, mensaje: string) {
    Swal.close();
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
}
