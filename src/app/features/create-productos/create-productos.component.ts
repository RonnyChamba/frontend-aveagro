import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
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
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-productos',
  standalone: true,
  imports: [ReactiveFormsModule, CustomSelectComponent, CustomInputComponent, NgOptimizedImage, NgbModule],
  templateUrl: './create-productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductosComponent implements OnInit {
  public readonly loading = signal(false);

  public readonly maxPhoneNumbers = this.config.maxPhoneNumbers;

  public readonly maxEmails = this.config.maxEmails;

  public cedulaLabel = this.identificationService.cedulaLabel;

  public productoIde: any = null;


  @Input()
  set data(data: any) {

    console.log(data);
    this.form.reset();
    this.form.get("mainCode")?.enable();
    this.productoIde = null;
    if (data && data.productoIde) {
      this.productoIde = data.productoIde;
      this.setEditarProducto();
    }
  }

  private destroy$ = new Subject<void>();


  public listUnidades: string[] = [
    'Unidad',
    'Libra'
  ];

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

  constructor(
    private readonly _fb: FormBuilder,
    private readonly config: LaGotitaConfigService,
    private readonly _pedidoService: PedidosService,
    private readonly identificationService: IdentificationValidatorService
  ) { }

  ngOnInit(): void {

    console.log(this.data);
    // if (this.form.controls.emails.length === 0) {
    //   this.addEmail();
    // }

    // if (this.form.controls.phones.length === 0) {
    //   this.addPhone();
    // }

    // this.form.controls.tipoDocumento.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((TipoDocumento) => {
    //   if (typeof TipoDocumento === 'string') {
    //     this.identificationService.updateCedulaValidators(this.form, TipoDocumento);
    //   }
    // });
  }

  public form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    mainCode: ['', [Validators.required]],
    auxiliaryCode: ['', []],
    price: ['', [Validators.required]],
    amount: ['', Validators.required],
    measurementUnit: ['', Validators.required]
  });

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const clientForm = this.form.value;
    console.log(clientForm);


    if (this.productoIde) {
      of(this.loading.set(true))
        .pipe(
          mergeMap(() => this._pedidoService.updateProducto(clientForm, this.productoIde)),
          finalize(() => this.loading.set(false)),
        )
        .subscribe((data) => {
          console.log(data);
          this.client.emit(data);
          this.form.reset();
        });
    } else {

      of(this.loading.set(true))
        .pipe(
          mergeMap(() => this._pedidoService.createProducto(clientForm)),
          finalize(() => this.loading.set(false)),
        )
        .subscribe((data) => {
          this.client.emit(data);
          this.form.reset();
        });
    }


  }

  setEditarProducto() {
    console.log(this.productoIde);


    of(this.loading.set(false))
      .pipe(
        mergeMap(() => this._pedidoService.getProducto(Number.parseInt(this.productoIde))),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data: any) => {

        console.log(data);

        if (data.status === 'OK') {
          this.form.patchValue(data.data, { emitEvent: false })

          this.form.get("mainCode")?.disable();
        } else {
          alert("Error al obtener informacion del producto");
        }
      });
  }




}
