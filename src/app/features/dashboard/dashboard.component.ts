import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, signal } from '@angular/core';
import { PedidosService } from '../../services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  constructor(
    private readonly pedidoService: PedidosService,

  ) {
    this.getProduct();
    this.getPedidosByCliente();
    this.getDoc();
   }

  public readonly producto = signal<any | null>(null);
  public readonly cliente = signal<any | null>(null);
  public readonly dataDoc = signal<any | null>(null);

  getProduct() {
    this.pedidoService.getProductos().subscribe((data) => {
      this.producto.set(data);

    });
  }

  getPedidosByCliente() {
    this.pedidoService.getClientes().subscribe((data) => {
      this.cliente.set(data);
    });
  }

  getDoc() {
    this.pedidoService.getDoc().subscribe((data) => {
      this.dataDoc.set(data);
    });
  }
}
