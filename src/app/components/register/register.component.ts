
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  type: string = 'password';
  eyeIcon: string = 'fa-eye-slash';
  
  fieldConfigs = [
    { name: 'email', placeholder: 'Email Address', type: 'email' },
    { name: 'password', placeholder: 'Password', type: this.type },
    { name: 'userName', placeholder: 'Username', type: 'text' },
    { name: 'phoneNumber', placeholder: 'Phone Number (e.g., 01012345678)', type: 'text' },
    { name: 'city', placeholder: 'City', type: 'text' },
    { name: 'country', placeholder: 'Country', type: 'text' },
    { name: 'countryCode', placeholder: 'Country Code', type: 'text' },
    { name: 'postalCode', placeholder: 'Postal Code', type: 'text' },
    { name: 'nationalID', placeholder: 'National ID', type: 'text' },
    { name: 'imageURL', placeholder: 'Image URL', type: 'text' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/(?=.*[A-Z])/), 
        Validators.pattern(/(?=.*\d)/),   
        Validators.pattern(/(?=.*[@!?*\.])/) 
      ]],
      userName: ['', [
        Validators.required, 
        Validators.maxLength(20)
      ]],
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern(/^01[012]\d{8}$/) 
      ]],
      city: [''],
      country: [''],
      countryCode: [''],
      postalCode: ['', Validators.required],
      nationalID: ['', Validators.required],
      imageURL: [''],
      terms: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  getErrorMessage(controlName: string) {
    const control = this.f[controlName];
    
    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required.`;
    }
    
    switch(controlName) {
      case 'email':
        if (control.hasError('email')) return 'Invalid email format.';
        break;
      case 'password':
        if (control.hasError('minlength')) return 'Password must be at least 6 characters.';
        if (control.hasError('pattern')) {
          if (!/(?=.*[A-Z])/.test(control.value)) return 'Password must contain at least one uppercase letter.';
          if (!/(?=.*\d)/.test(control.value)) return 'Password must contain at least one number.';
          if (!/(?=.*[@!?*\.])/.test(control.value)) return 'Password must contain at least one special character (@!?*.).';
        }
        break;
      case 'userName':
        if (control.hasError('maxlength')) return 'Username must not exceed 20 characters.';
        break;
      case 'phoneNumber':
        if (control.hasError('pattern')) return 'Phone number must be a valid Egyptian number (e.g., 01012345678).';
        break;
    }
    
    return '';
  }

  getFieldLabel(controlName: string): string {
    const labels: {[key: string]: string} = {
      'email': 'Email',
      'password': 'Password',
      'userName': 'Username',
      'phoneNumber': 'Phone number',
      'city': 'City',
      'country': 'Country',
      'countryCode': 'Country code',
      'postalCode': 'Postal code',
      'nationalID': 'National ID',
      'imageURL': 'Image URL'
    };
    
    return labels[controlName] || controlName;
  }

  hideShowPass(): void {
    this.type = this.type === 'password' ? 'text' : 'password';
    this.eyeIcon = this.type === 'password' ? 'fa-eye-slash' : 'fa-eye';
    

    this.fieldConfigs = this.fieldConfigs.map(field => {
      if (field.name === 'password') {
        return { ...field, type: this.type };
      }
      return field;
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log(this.registerForm.value); 
    this.router.navigate(['/login']); 
  }
}