import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { APP_CLIENTES, APP_PEDIDOS } from '../shared/constants';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private readonly _firestore: Firestore,
    private httpClient: HttpClient
  ) { }


  getProductos(): Observable<any> {
    return this.httpClient.get(environment.urlMsVeagro + "/productos/listar");
  }


  getProducto(productoIde: number): Observable<any> {
    return this.httpClient.get(environment.urlMsVeagro + "/productos/ver/" + productoIde);
  }

  createProducto(producto: any): Observable<any> {

    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload: producto
    }
    return this.httpClient.post(environment.urlMsVeagro + "/productos/guardar", request);
  }

  updateProducto(producto: any, productoIde: any): Observable<any> {

    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload: producto
    }
    return this.httpClient.put(environment.urlMsVeagro + "/productos/actualizar/" + productoIde, request);
  }


  deleteProducto(id: string): Observable<any> {

    return this.httpClient.delete(environment.urlMsVeagro + "/productos/eliminar/" + id);
  }

  getClientes(): Observable<any> {
    return this.httpClient.get(environment.urlMsVeagro + "/clientes/listar");
  }



  createCustomer(payload: any): Observable<any> {
    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload
    }
    return this.httpClient.post(environment.urlMsVeagro + "/clientes/guardar", request);
  }

  updateCustomer(payload: any, customerId: number): Observable<any> {
    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload
    }
    return this.httpClient.put(environment.urlMsVeagro + "/clientes/actualizar/" + customerId, request);
  }

  getCustomer(customerId: number): Observable<any> {
    return this.httpClient.get(environment.urlMsVeagro + "/clientes/ver/" + customerId);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.httpClient.delete(environment.urlMsVeagro + "/clientes/eliminar/" + id);

  }

  getUsers(): Observable<any> {
    return this.httpClient.get(environment.urlMsVeagro + "/usuarios/listar");
  }

  createUser(payload: any): Observable<any> {
    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload
    }
    return this.httpClient.post(environment.urlMsVeagro + "/usuarios/guardar", request);
  }

  getUser(customerId: number): Observable<any> {
    return this.httpClient.get(environment.urlMsVeagro + "/usuarios/ver/" + customerId);
  }


  deleteUser(id: string): Observable<any> {

    return this.httpClient.delete(environment.urlMsVeagro + "/usuarios/eliminar/" + id);
  }

  updateUser(payload: any, userId: number): Observable<any> {
    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload
    }
    return this.httpClient.put(environment.urlMsVeagro + "/usuarios/actualizar/" + userId, request);
  }

  saveVenta(payload: any): Observable<any> {
    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload
    }
    return this.httpClient.post(environment.urlMsVeagro + "/ventas/generateSale", request);
  }

  getDoc(): Observable<any> {
    return this.httpClient.get(environment.urlMsVeagro + "/ventas/facturas");
  }


  report(id: number): Observable<Blob> {
    return this.httpClient.get<Blob>(environment.urlMsVeagro + "/reportes/generar/" + id
      , {

        responseType: 'blob' as 'json'
      });
  }


  geraraReporte(payload:any): Observable<Blob> {
    const request = {
      origin: "App",
      usrRequest: "Veagro",
      payload
    }
    console.log(request);
    return this.httpClient.post<Blob>(environment.urlMsVeagro + "/reportes/generar", request,  {
     responseType: 'blob' as 'json'
    } );
  }
}
