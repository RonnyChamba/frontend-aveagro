import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ModalComponent } from '../../components';
import { TextInitialsPipe } from '../../pipes';
import { RouterLink } from '@angular/router';
import { PedidosService, UserService } from '../../services';
import { finalize, mergeMap, of, take } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';
import { CreateUserComponent } from '../create-user';
import { CreateClientesComponent } from '../create-clientes/create-clientes.component';
import { NotUserFoundComponent } from './components';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ModalComponent,
    TextInitialsPipe,
    RouterLink,
    NgOptimizedImage,
    CreateUserComponent,
    NotUserFoundComponent,
    ReactiveFormsModule
  ],
  templateUrl: './user.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  public readonly loading = signal(true);

  public readonly dataFlotante = signal<string>('');

  public readonly users = signal<any | null>(null);
  filteredUser: any[] = [];
    searchControl = new FormControl('');

    @ViewChild('newusersModal') productoModal!: ModalComponent;

    public readonly tipoAction = signal<string | null>('nuevo');

    public paramUserUpdate: any= null;

  constructor(private readonly userService: UserService,
    private readonly pedidoService: PedidosService
  ) {
    this.getUsers();

    this.searchControl.valueChanges.subscribe((value) => {
      const searchText = value?.toString().trim().toLowerCase() || '';

      // Si el campo de búsqueda está vacío, muestra todos los clientes
      this.filteredUser = searchText
        ? this.users().data.filter((user: any) =>
            user.name.toLowerCase().includes(searchText) ||
            user.dni.toLowerCase().includes(searchText)
          )
        : this.users().data;
    });
  }

  public deleteUsuario(id: string): void {
    of(this.loading.set(true))
      .pipe(
        take(1),
        mergeMap(() => this.pedidoService.deleteUser(id)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.getUsers();
      });
  }

  public getUsers(): void {
    this.loading.set(true);
    this.pedidoService
      .getUsers()
      .pipe(
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((genericResDTO) => {
        console.log(genericResDTO);
        this.users.set(genericResDTO);
        this.filteredUser = genericResDTO.data;
      });
  }

  addUser(user: any): void {

    this.getUsers();
    // this.users.set([...this.users(), user]);
  }

  openNewUser(type : string, userIde: any){
    this.tipoAction.set(type);

    this.paramUserUpdate = {
      userIde
    };

    this.productoModal.open();
  }
}
