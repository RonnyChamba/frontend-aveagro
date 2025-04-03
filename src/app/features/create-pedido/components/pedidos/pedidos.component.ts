import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CustomInputComponent, CustomSelectComponent } from '../../../../components';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LaGotitaConfigService } from '../../../../util';
import { finalize, mergeMap, of, take } from 'rxjs';
import { PedidosService } from '../../../../services';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CustomInputComponent, ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './pedidos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosComponent  {
}
