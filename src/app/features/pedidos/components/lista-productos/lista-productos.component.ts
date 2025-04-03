import { PedidosService } from './../../../../services/pedidos.service';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { NgClass, CurrencyPipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TextInitialsPipe } from '../../../../pipes';
import { NotificationService } from '../../../../util/services/notification.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, TextInitialsPipe],
  templateUrl: './lista-productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProductosComponent {


  public readonly listProducts = signal<any | null>(null);

  @Output() public readonly addProducto = new EventEmitter<any | null>();


  constructor(
    private readonly PedidosService: PedidosService,
    private readonly notification: NotificationService,
  ) {
    this.listProductos();
  }

  listProductos(): void {
    this.PedidosService.getProductos().subscribe((resp: any) => {
      if (resp.status === 'OK') {
        this.listProducts.set(resp);
      }
    });
  }




  addProduct(product: any) {

    this.addProducto.emit(product);


  }
}
