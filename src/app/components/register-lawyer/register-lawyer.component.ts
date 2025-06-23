import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-lawyer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register-lawyer.component.html',
  styleUrls: ['./register-lawyer.component.css']
})
export class RegisterLawyerComponent  {
  registerForm: FormGroup;
  formSubmitted = false;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/(?=.*[A-Z])(?=.*\d)(?=.*[@!?*\.])/)
      ]],
      userName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^01[012]\d{8}$/)]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      nationalID: ['', [Validators.required]],
      profileHeader: ['', [Validators.required]],
      bio: ['', [Validators.required]],
      lawyerCardID: ['', [Validators.required]],
      barAssociationCardNumber: ['', [Validators.required]],
      terms: [false, Validators.requiredTrue]
    });
  }

  get f() { return this.registerForm.controls; }

  getErrorMessage(controlName: string) {
    const control = this.f[controlName];
    
    if (!this.formSubmitted && !control.dirty) return '';
    
    if (control.hasError('required')) {
      return 'This field is required';
    }
    
    switch(controlName) {
      case 'email':
        return 'Invalid email format';
      case 'password':
        if (control.hasError('minlength')) return 'Min 6 characters';
        if (control.hasError('pattern')) {
          if (!/(?=.*[A-Z])/.test(control.value)) return 'Uppercase required';
          if (!/(?=.*\d)/.test(control.value)) return 'Number required';
          return 'Special character required (@!?*.)';
        }
        break;
      case 'phoneNumber':
        return 'Valid Egyptian number required';
    }
    
    return '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }

    console.log('Registration data:', this.registerForm.value);
    this.router.navigate(['/login']);
  }
}