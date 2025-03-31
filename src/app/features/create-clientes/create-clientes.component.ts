import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent, CustomSelectComponent } from '../../components';
import { finalize, mergeMap, of, Subject, takeUntil } from 'rxjs';
import {
  emailValidator,
  IdentificationValidatorService,
  LaGotitaConfigService,
  ObjectId,
  onlyLettersValidator,
  onlyNumbersValidator,
  SearchService,
} from '../../util';
import { PedidosService } from '../../services';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-create-clientes',
  standalone: true,
  imports: [ReactiveFormsModule, CustomSelectComponent, CustomInputComponent, NgOptimizedImage],
  templateUrl: './create-clientes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateClientesComponent {
  public readonly loading = signal(false);

  public readonly maxPhoneNumbers = this.config.maxPhoneNumbers;

  public readonly maxEmails = this.config.maxEmails;

  public readonly cedulaLabel = this.identificationService.cedulaLabel;
  private destroy$ = new Subject<void>();

  @Output() client = new EventEmitter<any | null>();
  public readonly tipo_documento = computed<{ values: string[]; labels: string[] }>(() => {
    return Object.entries(this.config.tipo_documento()).reduce(
      (prev, [value, key]) => {
        prev.labels.push(key);
        prev.values.push(value);

        return prev;
      },
      { values: [] as string[], labels: [] as string[] },
    );
  });

  public paramCustomerUpdate: any = null;

  @Input()
  set data(data: any) {

    this.form.reset();
    this.form.get("dni")?.enable();
    if (data && data.customerId) {
      this.paramCustomerUpdate = data;
      this.setEditarCustomer();
    }
  }

  constructor(
    private readonly _fb: FormBuilder,
    private readonly config: LaGotitaConfigService,
    private readonly _pedidoService: PedidosService,
    private readonly identificationService: IdentificationValidatorService,
  ) { }

  ngOnInit(): void {


    // this.form.controls.tipoDocumento.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((TipoDocumento) => {
    //   if (typeof TipoDocumento === 'string') {
    //     this.identificationService.updateCedulaValidators(this.form, TipoDocumento);
    //   }
    // });
  }

  public form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), onlyLettersValidator()]],
    // tipoDocumento: ['', [Validators.required]],
    dni: ['', [Validators.required, onlyNumbersValidator(), Validators.minLength(10), Validators.maxLength(13)]],
    address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), emailValidator()]],
    cellphone: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
  });

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const clientForm = {
      name: this.form.value.name!.trim(),
      dni: this.form.value.dni,
      address: this.form.value.address!.trim(),
      email: this.form.value.email,
      cellphone: this.form.value.cellphone,
    };


    if (this.paramCustomerUpdate && this.paramCustomerUpdate.customerId) {

      of(this.loading.set(true))
      .pipe(
        mergeMap(() => this._pedidoService.updateCustomer(clientForm, Number.parseInt(this.paramCustomerUpdate.customerId))),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data) => {
        console.log(data);
        if (data.status == 'OK') {
          this.client.emit(data);
          this.form.reset();
        }
      });


    } else {

      of(this.loading.set(true))
        .pipe(
          mergeMap(() => this._pedidoService.createCustomer(clientForm)),
          finalize(() => this.loading.set(false)),
        )
        .subscribe((data) => {
          console.log(data);
          if (data.status == 'OK') {

            this.client.emit(data);
            this.form.reset();
          }
        });
    }



  }

  setEditarCustomer() {
    console.log(this.paramCustomerUpdate);


    of(this.loading.set(false))
      .pipe(
        mergeMap(() => this._pedidoService.getCustomer(Number.parseInt(this.paramCustomerUpdate.customerId))),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data: any) => {

        console.log(data);
        if (data.status === 'OK') {
          this.form.patchValue(data.data, { emitEvent: false })
          this.form.get("dni")?.disable();
        } else {
          alert("Error al obtener informacion del producto");
        }
      });
  }



}
