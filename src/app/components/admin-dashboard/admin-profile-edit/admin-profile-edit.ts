import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export enum Gender {
  Male = 0,
  Female = 1
}

@Component({
  selector: 'app-admin-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profile-edit.html',
  styleUrl: './admin-profile-edit.css'
})
export class AdminProfileEdit implements OnInit {
  profileForm!: FormGroup;
  isLoading = false;
  successMsg = '';
  errorMsg = '';
  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female }
  ];
  Gender = Gender; // for template access
  profileImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      userName: [
        '',
        [Validators.required, Validators.minLength(3)]
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^(010|011|012|015)[0-9]{8}$')
        ]
      ],
      city: [
        '',
        [Validators.required]
      ],
      imageUrl: [''],
      country: [
        '',
        [Validators.required]
      ],
      countryCode: ['', [Validators.required, Validators.pattern('^[0-9]{1,5}$')]],
      postalCode: [
        '',
        [Validators.required]
      ],
      nationalityId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{14}$')
        ]
      ],
      gender: [Gender.Male, Validators.required]
    });
    this.fetchProfile();
  }

  fetchProfile() {
    this.isLoading = true;
    this.adminService.getAdminProfile().subscribe({
      next: (profile) => {
        console.log("admin profile=>>>>>",profile);
        this.profileForm.patchValue({
          userName: profile.name,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          city: profile.city,
          country: profile.country,
          countryCode: profile.countryCode,
          postalCode: profile.postalCode,
          nationalityId: profile.nationalityId,
          imageUrl: profile.imageUrl,
          gender: profile.gender === 'Male' ? Gender.Male : Gender.Female
        });
        this.profileImageUrl = profile.imageUrl;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load profile.';
        this.isLoading = false;
      }
    });
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.errorMsg = 'Only JPG and PNG images are allowed.';
        return;
      }
  
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.errorMsg = 'Image must be less than 2MB.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
        this.profileForm.patchValue({ imageUrl: this.profileImageUrl });
        
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';
    // console.log("profileForm.value=>>>>>",this.profileForm.value);

    const payload = this.profileForm.value;
    this.adminService.editAdminProfile(payload).subscribe({
      next: () => {
        this.successMsg = 'Profile updated successfully!';
        this.isLoading = false;
        this.router.navigate(['/dashboard/admin-dashboard/admin/profile']);
      },
      error: (err) => {
        this.errorMsg = 'Failed to update profile.';
        this.isLoading = false;
      }
    });
  }
}
