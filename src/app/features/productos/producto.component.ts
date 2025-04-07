import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, signal, ViewChild } from '@angular/core';
import { ModalComponent } from '../../components';
import { RouterLink } from '@angular/router';
import { TextInitialsPipe } from '../../pipes';
import {  PedidosService } from '../../services';
import { finalize, mergeMap, of, take } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';
import { CreateClientesComponent } from '../create-clientes';
import { ClientsNotFoundComponent } from './components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CreateProductosComponent } from "../create-productos/create-productos.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    ClientsNotFoundComponent,
    CreateProductosComponent
],
  templateUrl: './producto.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoComponent {
  public readonly loading = signal(true);

  public readonly clients = signal<any | null>(null);
  public readonly tipoAction = signal<string | null>('nuevo');
filteredProduct: any[] = [];
    searchControl = new FormControl('');
  @ViewChild('newClientModal') productoModal!: ModalComponent;


  public readonly dataFlotante = signal<string>('');

  public productIdeUpdate: any= null;
  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly pedidoService: PedidosService
  ) {
    this.getPedidosByCliente();

    this.searchControl.valueChanges.subscribe((value) => {
      const searchText = value?.toString().trim().toLowerCase() || '';

      // Si el campo de búsqueda está vacío, muestra todos los clientes
      this.filteredProduct = searchText
        ? this.clients().data.filter((user: any) =>
            user.name.toLowerCase().includes(searchText)

          )
        : this.clients().data;
    });
  }

  public deleteClient(id: string): void {
    console.log(id);
    of(this.loading.set(true))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        mergeMap(() => this.pedidoService.deleteProducto(id)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
      this.getPedidosByCliente();
      });
  }

  getPedidosByCliente() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.pedidoService.getProductos()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((clientes) => {
      this.filteredProduct = clientes.data;
        this.clients.set(clientes);
      });
  }

  public addClient(resp: any): void {

    console.log(resp);
    if (resp.status ==='OK'){
      this.getPedidosByCliente();

    }else{
      alert('erro al registrar producto');
    }
    // this.clients.set([...this.clients(), client]);
  }


  openNewProducto(type : string, productoIde: any){
    this.tipoAction.set(type);

    this.productIdeUpdate = {
      productoIde: productoIde
    };

    this.productoModal.open();
  }
}
