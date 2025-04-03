import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostListener, Input, signal } from '@angular/core';
import { ModalComponent } from '../../components';
import { CreatePedidoComponent } from '../create-pedido';
import { PedidosService } from '../../services';
import { of, delay, finalize, mergeMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CreateClientesComponent } from '../create-clientes';
import { consumidorFinal } from '../../interfaces/constante';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListaProductosComponent } from './components';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgOptimizedImage, ModalComponent, FormsModule, CreateClientesComponent, NgOptimizedImage, CurrencyPipe, ListaProductosComponent],
  templateUrl: './pedidos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosComponent {


  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.dropdown');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.dropdownOpen.set(false);
    }
  }


  public readonly loading = signal(false);
  public readonly dropdownOpen = signal(false);
  public readonly loadingCombo = signal(false);
  public readonly filteredOptions = signal<any | null>(null);
  public readonly selectedCliente = signal<any | null>(null);
  public readonly products = signal<any[]>([]);
  public readonly Math = Math;
  public searchTerm = '';

  selectOption(cliente: any) {
    this.dropdownOpen.set(false);
    this.loading.set(true);
    of(null)
      .pipe(
        delay(500),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.selectedCliente.set(cliente);
        this.dropdownOpen.set(false);

      });
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  constructor(
    private readonly pedidoService: PedidosService
  ) {
    this.getPedidosByCliente();
  }

  /**
   * Busca los clientes que coinciden con el texto ingresado en el input
   * @param event Evento del input
   */
  search(event: any) {
    const text = event.target.value.trim();
    this.searchTerm = text;

    // Si el texto tiene al menos 2 caracteres, buscar los clientes
    if (text.length >= 2) {
      // this.getCustomer(this.idePersonal()!);
      this.dropdownOpen.set(true);
    } else if (text.length === 0) {
      // Si no hay texto, mostrar todos los clientes
      // this.getCustomer(this.idePersonal()!);
      this.dropdownOpen.set(true);
    }
  }

  getPedidosByCliente() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.pedidoService.getClientes()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((genericResp) => {
        genericResp.data.unshift(consumidorFinal);
        this.filteredOptions.set(genericResp);
      });
  }



  createCliente(event: any) {
    if (event.status === 'OK') {
      // this.emisionService.listCustomer(this.idePersonal()!, this.searchTerm, 0).subscribe((resp) => {
      //   if (resp.status === 'OK') {
      //     resp.data.unshift(consumidorFinal);
      //     this.filteredOptions.set(resp);
      //   }
      // });
    }
  }




  decrementCantidad(product: any): void {
    this.products.update((currentProducts) =>
      currentProducts.map((p) =>
        p.id === product.id
          ? { ...p, amount: Math.max(1, p.amount - 1), valorTotal: Math.max(1, p.amount - 1) * p.price }
          : p
      )
    );
  }

  incrementCantidad(product: any): void {
    this.products.update((currentProducts) =>
      currentProducts.map((p) =>
        p.id === product.id
          ? { ...p, amount: p.amount + 1, valorTotal: (p.amount + 1) * p.price }
          : p
      )
    );
  }

  addProducto(product: any) {
    this.products.update((currentProducts) => {
      const existingProductIndex = currentProducts.findIndex((p) => p.id === product.id);

      if (existingProductIndex !== -1) {
        return currentProducts.map((p, index) =>
          index === existingProductIndex
            ? { ...p, amount: p.amount + 1, valorTotal: (p.amount + 1) * p.price }
            : p
        );
      } else {
        const newProduct = { ...product, amount: 1, valorTotal: product.price };
        console.log('Nuevo producto agregado:', newProduct);
        return [...currentProducts, newProduct];
      }
    });
  }

  updateProduct(product: any) {
    this.products.update((currentProducts) =>
      currentProducts.map((p) =>
        p.id === product.id
          ? { ...p, amount: Math.max(1, product.amount), valorTotal: Math.max(1, product.amount) * product.price }
          : p
      )
    );
  }


  removeProduct(id: number) {
    this.products.update((currentProducts) => currentProducts.filter((product) => product.ide !== id));
  }

  restrictInput(event: KeyboardEvent) {
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'Backspace', 'Tab'];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  totalPago(): number {
    return this.products().reduce((total, product) => total + product.valorTotal, 0);
  }


  guardar() {



    const productos = this.products().map((p) => (
      {
        name: p.name,
        mainCode: p.mainCode,
        auxiliaryCode: p.auxiliaryCode,
        description: "sin data",
        price: p.price,
        amount: p.amount,
        measurementUnit: p.measurementUnit,
        subtotal: p.valorTotal
      }));


    const data = {
      products: productos,
      total: this.totalPago(),
      customer: {
        name: this.selectedCliente().name,
        dni: this.selectedCliente().dni,
        address: this.selectedCliente().address,
        email: this.selectedCliente().email,
        cellphone: this.selectedCliente().cellphone,
      }
    };


 of(this.loading.set(true)).pipe(
      mergeMap(() => this.pedidoService.saveVenta(data)),
      finalize(() => this.loading.set(false)),
    ).subscribe((resp) => {
      this.products.set([]);
      this.filteredOptions.set(null);
      this.selectedCliente.set(null);
    });

  }















}
