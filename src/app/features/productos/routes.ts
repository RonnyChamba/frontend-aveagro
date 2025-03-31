import { Route } from '@angular/router';
import { ProductoComponent } from './producto.component';

export default [
  {
    path: '',
    component: ProductoComponent,
  },
   {
     path: ':id',
     loadComponent: () => import('./../clientes-details').then((m) => m.ClientesDetailsComponent),
   },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
