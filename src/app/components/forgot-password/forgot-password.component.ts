
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgClass
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {


  step: number = 1;
  islodaing: boolean = false;
  messError: string = "";
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  verifyEmail: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  resetPasswordForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // لازم 6 أرقام بالضبط
    newPassword: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@!?*\.]).{6,}$/)
    ]]
  });


  SendEmail() {


    let email = this.verifyEmail.value.email;

    this.resetPasswordForm.get('email')?.patchValue(email);
    this.islodaing = true;
    this._authService.setEmailVerify(this.verifyEmail.value).subscribe({
      next: (res) => {
        console.log(res);


        if (res.message == "Operation successful") {
          this.step = 2;
          this.islodaing = false;
        }


      },
      error: (err) => {
        this.islodaing = false;
        console.error(err);
        this.messError = err.error.message;
      }

    })


  }


  resetPassword() {

    this.islodaing = true;
    const payload = this.resetPasswordForm.value;
    this._authService.setResetPassword(payload).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == "Operation successful") {
          this._router.navigate(['/login']);
          this.islodaing = false;
        }


      },
      error: (err) => {
        console.log(err)

        this.islodaing = false;
        this.messError = err.error.message;
      }
    });
  }
}

