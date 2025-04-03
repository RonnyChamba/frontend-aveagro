import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services';
import { catchError, finalize, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';


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

    const req = {
      username: this.form.value.email,
      password: this.form.value.password
    }
    this._authService.login(req)
      .pipe(
        tap((resp: any) => {

          const tokenJwt = resp.data?.token;
          this._authService.saveToken(tokenJwt);
          this.router.navigate(['/dashboard']);

        }),
        catchError((error: any) => {
          console.log(error);
          return of(null);
        })
      )
      .subscribe();
  }
}
