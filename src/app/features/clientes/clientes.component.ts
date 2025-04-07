import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal, ViewChild } from '@angular/core';
import { ModalComponent } from '../../components';
import { RouterLink } from '@angular/router';
import { TextInitialsPipe } from '../../pipes';
import { PedidosService } from '../../services';
import { finalize, mergeMap, of, take, takeUntil } from 'rxjs';
import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { CreateClientesComponent } from '../create-clientes';
import { ClientsNotFoundComponent } from './components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './clientes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientesComponent {
  public readonly loading = signal(true);

  public readonly clients = signal<any | null>(null);

  public readonly dataFlotante = signal<string>('');

  public readonly tipoAction = signal<string | null>('nuevo');
  @ViewChild('newClientModal') productoModal!: ModalComponent;

  public paramCustomerUpdate: any = null;

  searchControl = new FormControl('');

  filteredClients: any[] = [];

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly pedidoService: PedidosService,
  ) {
    this.getPedidosByCliente();
    this.searchControl.valueChanges.subscribe((value) => {
      const searchText = value?.toString().trim().toLowerCase() || '';

      // Si el campo de búsqueda está vacío, muestra todos los clientes
      this.filteredClients = searchText
        ? this.clients().data.filter((client: any) =>
            client.name.toLowerCase().includes(searchText) ||
            client.dni.toLowerCase().includes(searchText)
          )
        : this.clients().data;
    });

  }


  public deleteClient(id: string): void {
    of(this.loading.set(true))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        mergeMap(() => this.pedidoService.deleteCustomer(id)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.getPedidosByCliente();
      });
  }

  getPedidosByCliente() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.pedidoService.getClientes()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((genericResp) => {
        this.clients.set(genericResp);
        this.filteredClients = genericResp.data;
      });
  }

  public addClient(data: any): void {
    this.getPedidosByCliente();
  }


  openModalCustomer(type: string, customerId: any) {
    this.tipoAction.set(type);
    this.paramCustomerUpdate = {
      customerId: customerId
    };

    this.productoModal.open();
  }
}
