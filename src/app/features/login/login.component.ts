import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services';
import { catchError, finalize, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageServiceAlert } from '../../services/message.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public readonly loanding = signal(false);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageServiceAlert
  ) {}

  public form = this._fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, ]],
  });

   submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.messageService.loadingConMensaje(true, 'Validando credenciales...');

   setTimeout(() => {

const req = {
      username: this.form.value.email,
      password: this.form.value.password
    }
    this._authService.login(req)
      .pipe(
        tap((resp: any) => {

          console.log(resp);
          const tokenJwt = resp.data?.token;
          this._authService.saveToken(tokenJwt);
          this._authService.saveRolApp( resp.data?.rol);
          this.messageService.loadingConMensaje(false);
          this.router.navigate(['/dashboard']);
        }),
        catchError((error: any) => {
          console.log(error);
          this.messageService.mensajeErrorTitulo(error.error?.message ?? 'Error', 'No se pudo iniciar sesión, verifique sus credenciales.');
          return of(null);
        })
      )
      .subscribe();
    
   }, 1100);
    
  }
}
