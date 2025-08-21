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

  public mensajeInfo(mensaje: string) {
    Swal.close();
    const response = Swal.fire({
      title: 'Información',
      text: mensaje,
      icon: 'info',
      allowOutsideClick: false,
      confirmButtonText: 'OK',
    });

    return response;
  }

    public mensajeSuccess(mensaje: string) {
    Swal.close();
    const response = Swal.fire({
      title: 'Correcto',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    });

    return response;
  }

  
  public mensajeConfirmationTitle(
    titulo: string,
    mensaje: string,
    icon: 'warning' | 'error' | 'info' | 'success' = 'info',
    tituloBotonConfirmacion: string = 'Confirmar',
    tituloBotonCancelacion: string = 'Cancelar',
  ) {
    Swal.close();
   return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: tituloBotonConfirmacion,
      cancelButtonText: tituloBotonCancelacion,
    });
  }


}
