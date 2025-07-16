import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LawyerService } from '../../core/services/lawyer.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Gender } from '../../types/Lawyers/LawyerListDTO';

@Component({
  selector: 'app-edit-lawyer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-lawyer-profile.component.html',
  styleUrl: './edit-lawyer-profile.component.css',
})
export class EditLawyerProfileComponent implements OnInit {
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
  profileUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private lawyerService: LawyerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.required]],
      profileHeader: ['', [Validators.required]],
      profileAbout: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      countryCode: ['', [Validators.required, Validators.pattern('^[A-Z]{2}$')]],
      postalCode: ['', [Validators.required]],
      nationalityId: ['', [Validators.required, Validators.pattern('^[0-9]{14}$')]],
      hourlyRate: [null, [Validators.required, Validators.min(1)]],
      experience: [0, [Validators.required, Validators.min(0)]],
      gender: [Gender.Male, Validators.required],
      barAssociationCardNumber: ['', [Validators.pattern('^[0-9]{5,6}$')]],
      imageUrl: ['']
    });
    this.fetchProfile();
  }

  fetchProfile() {
    this.isLoading = true;
    this.lawyerService.GetLawyerDetails().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          userName: profile.userName,
          bio: profile.bio,
          profileHeader: profile.profileHeader,
          profileAbout: profile.profileAbout,
          city: profile.city,
          country: profile.country,
          countryCode: profile.countryCode,
          postalCode: profile.postalCode,
          nationalityId: profile.nationalityId,
          hourlyRate: profile.hourlyRate,
          experience: profile.experience,
          gender: profile.gender,
          barAssociationCardNumber: profile.barAssociationCardNumber,
          imageUrl: profile.imageUrl
        });
        this.profileUserId = profile.userId;
        this.profileImageUrl = profile.imageUrl || '';
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
    const payload = this.profileForm.value;
    this.lawyerService.editLawyerProfile(payload).subscribe({
      next: () => {
        this.successMsg = 'Profile updated successfully!';
        this.isLoading = false;
        this.router.navigate([`/profile/${this.profileUserId}`]);
      },
      error: () => {
        this.errorMsg = 'Failed to update profile.';
        this.isLoading = false;
      }
    });
  }
}
