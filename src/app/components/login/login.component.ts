import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  getErrorMessage(controlName: string) {
    const control = this.f[controlName];

    if (!this.formSubmitted && !control.dirty) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    switch (controlName) {
      case 'email':
        return 'Invalid email format';
    }

    return '';
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    console.log('Login data:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },

      error: (err) => {
        this.errorMessage = 'Invalid email or password. Please try again.';
        console.error('Login failed', err);
      },
    });
    // this.router.navigate(['']);
  }
}
