import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, of, mergeMap, finalize } from 'rxjs';
import { PedidosService, UserService } from '../../services';
import {
  IdentificationValidatorService,
  onlyLettersValidator,
  onlyNumbersValidator,
  passwordValidator,
  ObjectId,
  emailValidator,
  LaGotitaConfigService,
} from '../../util';
import { User } from '../../interfaces';
import { CustomInputComponent, CustomSelectComponent } from '../../components';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent, CustomSelectComponent, NgOptimizedImage],
  templateUrl: './create-user.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent {
  public readonly loading = signal(false);

  public readonly maxPhoneNumbers = this.config.maxPhoneNumbers;

  public readonly maxEmails = this.config.maxEmails;

  @Output() user = new EventEmitter<User | null>();

  public readonly cedulaLabel = this.identificationService.cedulaLabel;

  private destroy$ = new Subject<void>();

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

  public readonly rol = computed<{ values: string[]; labels: string[] }>(() => {
    return Object.entries(this.config.rol()).reduce(
      (prev, [value, key]) => {
        prev.labels.push(key);
        prev.values.push(value);

        return prev;
      },
      { values: [] as string[], labels: [] as string[] },
    );
  });


  public paramUserUpdate: any = null;

  @Input()
  set data(data: any) {

    this.form.reset();
    this.form.get("dni")?.enable();
    this.form.get("password")?.enable();

    if (data && data.userIde) {
      this.paramUserUpdate = data;
      this.setEditarUser();
    } else {
      // Agregar validadores
      this.form.get("password")?.setValidators([Validators.required, Validators.minLength(8), passwordValidator()]);
      this.form.get("password")?.updateValueAndValidity();
    }
  }

  constructor(
    public readonly _fb: FormBuilder,
    public readonly config: LaGotitaConfigService,
    public readonly userService: UserService,
    public readonly pedidoService: PedidosService,
    private readonly identificationService: IdentificationValidatorService,
  ) { }

  ngOnInit(): void {

  }

  public form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), onlyLettersValidator()]],
    dni: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
    address: ['', [Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
    email: ['', [emailValidator(), Validators.maxLength(50)]],
    cellphone: ['', [onlyNumbersValidator(), Validators.maxLength(10)]],
    rolName: ['', [Validators.required]],
  });

  public submit() {
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const userForm = this.form.value as any;
    console.log(userForm);


    if (this.paramUserUpdate && this.paramUserUpdate.userIde) {
      of(this.loading.set(true))
        .pipe(
          mergeMap(() => this.pedidoService.updateUser(userForm, this.paramUserUpdate.userIde)),
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            this.user.emit(data);
            this.form.reset();
          },
          error: (error) => {

            const dtoError = error.error;
            alert(dtoError.message);
          }
        });

    } else {
      of(this.loading.set(true))
        .pipe(
          mergeMap(() => this.pedidoService.createUser(userForm)),
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            this.user.emit(data);
            this.form.reset();
          },
          error: (error) => {

            const dtoError = error.error;
            alert(dtoError.message);
          }
        });
    }


  }

  setEditarUser() {
    console.log(this.paramUserUpdate);


    of(this.loading.set(false))
      .pipe(
        mergeMap(() => this.pedidoService.getUser(Number.parseInt(this.paramUserUpdate.userIde))),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data: any) => {

        console.log(data);
        if (data.status === 'OK') {
          data.data.password = "*****************";
          this.form.patchValue(data.data, { emitEvent: false })
          this.form.get("dni")?.disable();
          this.form.get("password")?.disable();

          // Remover validadores
          this.form.get("password")?.clearValidators();

          // Actualizar el estado del control
          this.form.get("password")?.updateValueAndValidity();
        } else {
          alert("Error al obtener informacion del producto");
        }
      });
  }
}
