import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, signal, ViewChild } from '@angular/core';
import { ModalComponent } from '../../components';
import { RouterLink } from '@angular/router';
import { TextInitialsPipe } from '../../pipes';
import { ClienteService, PedidosService } from '../../services';
import { finalize, mergeMap, of, take } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';
import { CreateClientesComponent } from '../create-clientes';
import { ClientsNotFoundComponent } from './components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CreateProductosComponent } from "../create-productos/create-productos.component";
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    ModalComponent,
    RouterLink,
    TextInitialsPipe,
    NgOptimizedImage,
    CreateClientesComponent,
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

  @ViewChild('newClientModal') productoModal!: ModalComponent;


  public readonly dataFlotante = signal<string>('');

  public productIdeUpdate: any= null;
  constructor(
    private readonly clientService: ClienteService,
    private readonly destroyRef: DestroyRef,
    private readonly pedidoService: PedidosService
  ) {
    this.getPedidosByCliente();
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
        console.log(clientes);
        console.log("Productos");
        this.clients.set(clientes.data);
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
