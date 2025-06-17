import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register-lawyer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-lawyer.component.html',
  styleUrls: ['./register-lawyer.component.css']
})
export class RegisterLawyerComponent {
  registerForm: FormGroup;
  type: string = 'password';
  eyeIcon: string = 'fa-eye-slash';

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      countryCode: ['', Validators.required],
      postalCode: ['', Validators.required],
      nationalID: ['', Validators.required],
      imageURL: ['', Validators.required],

   
      profileHeader: ['', Validators.required],
      profileAbout: ['', Validators.required],
      lawyerCardID: ['', Validators.required],
      bio: ['', Validators.required],
      barCardImagePath: ['', Validators.required],
      barAssociationCardNumber: ['', Validators.required],

      terms: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  hideShowPass(): void {
    this.type = this.type === 'password' ? 'text' : 'password';
    this.eyeIcon = this.type === 'password' ? 'fa-eye-slash' : 'fa-eye';
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
