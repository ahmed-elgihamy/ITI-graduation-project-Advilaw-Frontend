import { concatWith } from 'rxjs';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-lawyer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgClass],
  templateUrl: './register-lawyer.component.html',
  styleUrls: ['./register-lawyer.component.css'],
})
export class RegisterLawyerComponent {
  formSubmitted = false;
  passwordVisible = false;
  islodaing: boolean = false;
  messError: string = '';
  role: string = 'Lawyer';
  fileInputs: { [key: string]: File | null } = {
    lawLicenseImage: null,
    barCardImage: null,
  };

  imagePreviews: { [key: string]: string | ArrayBuffer | null } = {
    lawLicenseImage: null,
    barCardImage: null,
  };

  private readonly _Auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly _Router = inject(Router);
  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@!?*\.]).{6,}$/),
      ],
    ],
    userName: ['', [Validators.required]],
    city: ['', Validators.required],
    country: ['', Validators.required],
    postalCode: ['', Validators.required],
    NationalityId: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    barAssociationCardNumber: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)],
    ],
    NationalIDImage: [null, Validators.required],
    barCardImage: [null, Validators.required],
    FieldIds: ['', Validators.required],
    gender: ['', Validators.required],
  });

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onFileSelected(
    event: Event,
    controlName: 'NationalIDImage' | 'barCardImage'
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.fileInputs[controlName] = file;
    this.registerForm.patchValue({ [controlName]: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[controlName] = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onSubmit(): void {
    this.islodaing = true;
    this.messError = '';

    const formData = new FormData();

    const controls = this.registerForm.controls;
    formData.append('email', controls['email'].value);
    formData.append('password', controls['password'].value);
    formData.append('userName', controls['userName'].value);
    formData.append('city', controls['city'].value);
    formData.append('country', controls['country'].value);
    formData.append('postalCode', controls['postalCode'].value);
    formData.append(
      'NationalityId',
      controls['NationalityId'].value.toString()
    );
    formData.append(
      'barAssociationCardNumber',
      controls['barAssociationCardNumber'].value.toString()
    );
    formData.append('FieldIds', controls['FieldIds'].value);
    formData.append('gender', controls['gender'].value);
    formData.append('role', this.role);

    if (this.fileInputs['NationalIDImage']) {
      formData.append('NationalIDImage', this.fileInputs['NationalIDImage']);
    }

    if (this.fileInputs['barCardImage']) {
      formData.append('barCardImage', this.fileInputs['barCardImage']);
    }

    if (this.registerForm.invalid) {
      this.messError = 'Please fill all required fields correctly';
      this.islodaing = false;
      return;
    }
    console.log('formData', this.registerForm.value);
    this._Auth.setRegisterForm(formData).subscribe({
      next: (res) => {
        console.log('res', res);
        if (res?.message === 'Email already exists.') {
          this.messError = res.message;
        } else if (res?.succeeded || res?.message === 'Operation successful') {
          this._Router.navigate(['/login']);
        } else {
          this.messError = 'Unexpected response';
        }
        this.islodaing = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('err', err);
        this.messError = err.error?.message || 'Registration failed';
        this.islodaing = false;
      },
      complete: () => {
        this.islodaing = false;
      },
    });
  }
}
