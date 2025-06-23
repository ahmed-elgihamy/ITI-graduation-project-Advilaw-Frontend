
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  formSubmitted = false;
  isProcessing = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotForm.controls; }

  getErrorMessage() {
    const emailControl = this.f['email'];
    
    if (!this.formSubmitted && !emailControl.dirty) return '';
    
    if (emailControl.hasError('required')) {
      return 'Email is required';
    }
    
    if (emailControl.hasError('email')) {
      return 'Invalid email format';
    }
    
    return '';
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.forgotForm.invalid) {
      return;
    }

    this.isProcessing = true;
    
    /*
    this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: () => {
        this.isProcessing = false;
        this.router.navigate(['/reset-confirmation']);
      },
      error: (err) => {
        console.error('Password reset failed', err);
        this.isProcessing = false;
        // Show error message to user
      }
    });
    */
  }
}

