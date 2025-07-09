import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';


export enum Gender {
  Male = 0,
  Female = 1
}

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css'
})
export class ClientProfileComponent implements OnInit {
  client: Client | null = null;
  isLoading = true;
  isEditing = false;
  editForm: any = {};
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
  // Form related properties
  profileForm!: FormGroup;
  successMsg = '';
  errorMsg = '';
  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female }
  ];
  Gender = Gender; // for template access

  constructor(
    private clientService: ClientService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfileData();
    this.profileForm.disable(); // Disable form by default
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      imageUrl:[''],
      userName: [
        '',
        [Validators.required, Validators.minLength(3)]
      ],
      phoneNumber: [
        '',
        [
          Validators.pattern('^(010|011|012|015)[0-9]{8}$')
        ]
      ],
      city: [
        '',
        [Validators.required]
      ],
      country: [
        '',
        [Validators.required]
      ],
      countryCode: ['', [ Validators.pattern('^[0-9]{1,5}$')]],
      postalCode: [
        '',
      ],
      nationalityId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{14}$')
        ]
      ],
      gender: [Gender.Male, Validators.required],
    });
  }

  loadProfileData(): void {
    this.isLoading = true;
    
    // Load client profile
    this.clientService.getClientProfile().subscribe({
      next: (response) => {
        const profile = response.data;
        this.client = profile;
        this.editForm = { ...this.client };
        // Populate the reactive form
        this.profileForm.patchValue({
          userName: profile.userName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          imageUrl:profile.imageUrl,
          city: profile.city,
          country: profile.country,
          countryCode: profile.countryCode,
          postalCode: profile.postalCode,
          nationalityId: profile.nationalityId,
          gender: profile.gender === 'Male' ? Gender.Male : Gender.Female
        });
        console.log(this.profileForm)
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
      }
    });


  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        this.errorMsg = 'Only JPG and PNG images are allowed.';
        return;
      }
  
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.errorMsg = 'Image must be less than 2MB.';
        return;
      }

      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default-profile.png';
  }

  setEditMode(isEditing: boolean): void {
    this.isEditing = isEditing;
    if (isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload = this.profileForm.value;
    console.log(payload);
    
    // First upload image if selected
    if (this.selectedImage) {
      this.clientService.uploadProfileImage(this.selectedImage).subscribe({
        next: (imageResponse) => {
          // Update payload with new image URL
          payload.imageUrl = imageResponse.data?.imageUrl || imageResponse.data?.url;
          this.updateProfileData(payload);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.errorMsg = 'Failed to upload image.';
          this.isLoading = false;
        }
      });
    } else {
      this.updateProfileData(payload);
    }
    this.setEditMode(false); // Disable form after saving
  }

  private updateProfileData(payload: any): void {
    this.clientService.updateClientProfile(payload).subscribe({
      next: (response) => {
        this.client = response.data;
        this.successMsg = 'Profile updated successfully!';
        this.setEditMode(false);
        this.selectedImage = null;
        this.imagePreview = null;
        this.isLoading = false;
        
        // Refresh profile data
        setTimeout(() => {
          this.loadProfileData();
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMsg = 'Failed to update profile.';
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.setEditMode(false);
    this.selectedImage = null;
    this.imagePreview = null;
    this.successMsg = '';
    this.errorMsg = '';
    
    // Reset form to original values by reloading profile data
    this.loadProfileData();
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required.`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address.';
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      }
      if (control.errors['pattern']) {
        if (controlName === 'phoneNumber') {
          return 'Please enter a valid Egyptian phone number.';
        }
        if (controlName === 'nationalityId') {
          return 'Please enter a valid 14-digit national ID.';
        }
        if (controlName === 'countryCode') {
          return 'Please enter a valid country code.';
        }
      }
    }
    return '';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
