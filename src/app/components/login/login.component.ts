import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  formSubmitted = false;
  passwordVisible = false;
  isLoading: boolean = false;
  messError: string = "";
  role: string = 'Lawyer';


  private readonly _Auth = inject(AuthService)
  private readonly fb = inject(FormBuilder)
  private readonly _Router = inject(Router)
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@!?*\.]).{6,}$/)
    ]],
  });



  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin(): void {
    this.isLoading = true;
    this.messError = "";


    if (this.loginForm.valid) {
      this._Auth.setLoginForm(this.loginForm.value).subscribe({
        next: (res) => {

          console.log(res)
          if (res.succeeded) {
            this._Auth.logIn(res.token);
            // localStorage.setItem("userToken", res.token);
            this._Router.navigate(['']);
          }


          console.log(res)
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {


          this.messError = err.error.error


          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      this.messError = 'Please fill all required fields correctly';
    }
  }
}
