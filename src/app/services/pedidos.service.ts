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

  private readonly _collectionCliente = collection(this._firestore, APP_CLIENTES.COLLECTION_NAME);



  createCliente(createClient: Partial<any>): Promise<any> {
    console.log('createClient', createClient);
    const docRef = doc(
      collection(
        this._firestore,

        APP_CLIENTES.COLLECTION_NAME,
      ),
    ); // Crea una referencia al nuevo documento
    return setDoc(docRef, {
      ...createClient,
      created: Date.now(),
      updated: Date.now(),
    }).then(() => {
      // Devuelve los datos de la prenda junto con el id generado por Firebase
      console
      return { id: docRef.id, ...createClient }; // Incluye el id generado por Firebase
    });
  }

  createPedido(pedido: Partial<any>, idCliente: string): Promise<DocumentReference<DocumentData>> {
    console.log('pedido', pedido);
    const pedidosCollectionRef = collection(this._firestore, `clientes/${idCliente}/pedidos`);
    return addDoc(pedidosCollectionRef, {
      ...pedido,
      created: Date.now(),
      updated: Date.now(),
    });
  }

  updatePedido(idCliente: string, pedidoId: string, cambios: Partial<any>): Promise<void> {
    console.log('cambios', cambios);
    console.log('idCliente', idCliente);
    console.log('pedidoId', pedidoId);
    const pedidoRef = doc(this._firestore, `${APP_CLIENTES.COLLECTION_NAME}/${idCliente}/pedidos/${pedidoId}`);
    return updateDoc(pedidoRef, {
      ...cambios,
      updated: Date.now(),
    });
  }



  removePedido(idCliente: string, idPedido: string): Promise<void> {
    const pedidoDocRef = doc(this._firestore, `clientes/${idCliente}/pedidos/${idPedido}`);
    return deleteDoc(pedidoDocRef);
  }

  async getPedidosByCliente(idCliente: string): Promise<any[]> {
    try {
      const pedidosCollectionRef = collection(this._firestore, `clientes/${idCliente}/pedidos`);
      const querySnapshot = await getDocs(pedidosCollectionRef);

      const pedidos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return pedidos;
    } catch (error) {
      throw error;
    }
  }


  getClientesConPedidos(): Observable<any[]> {
    return from(
      (async () => {
        try {
          const clientesCollectionRef = collection(this._firestore, 'clientes');
          const clientesSnapshot = await getDocs(clientesCollectionRef);

          const clientesConPedidos = await Promise.all(
            clientesSnapshot.docs.map(async (clienteDoc) => {
              const clienteData = {
                id: clienteDoc.id,
                ...clienteDoc.data(),
              };

              const pedidosCollectionRef = collection(this._firestore, `clientes/${clienteDoc.id}/pedidos`);
              const pedidosQuerySnapshot = await getDocs(pedidosCollectionRef);

              const pedidos = pedidosQuerySnapshot.docs.map((pedidoDoc) => ({
                id: pedidoDoc.id,
                ...pedidoDoc.data(),
              }));

              return {
                ...clienteData,
                pedidos: pedidos,
              };
            })
          );

          return clientesConPedidos;
        } catch (error) {
          throw error;
        }
      })()
    );
  }
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

  deleteCustomer(id: string):  Observable<any> {
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
}
