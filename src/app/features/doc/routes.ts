import { Route } from '@angular/router';
import { DocComponent } from './doc.component';

export default [
  {
    path: '',
    component: DocComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
