import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Lawyer } from '../../../core/models/lawyer.model';
import { env } from '../../../core/env/env';

@Component({
  selector: 'app-lawyer-details',
  templateUrl: './lawyer-details.component.html',
  imports: [CommonModule, RouterModule]
})
export class LawyerDetailsComponent implements OnInit {
  lawyer: any;
  lawyerImageUrl: string = '';
  barCardImageUrl: string = '';
  nationalIDImageUrl: string = '';
  lawyerForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.lawyerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      imageUrl: [''],
      barCardImage: [''],
      nationalIDImage: [''],
      // Add other fields as needed
    });

    const id = this.route.snapshot.paramMap.get('id');
  
    console.log('Lawyer ID from route:', id);
  
    if (id) {
      this.adminService.getLawyerById(id).subscribe({
        next: (data: Lawyer) => {
          this.lawyer = data;
          this.lawyerForm.patchValue({
            userName: data.userName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            city: data.city,
            country: data.country,
            imageUrl: data.imageUrl,
            barCardImage: data.barCardImagePath ?? '',
            nationalIDImage: data.nationalIDImagePath ?? '',
            // Patch other fields as needed
          });
          this.lawyerImageUrl = data.imageUrl;
          this.barCardImageUrl = data.barCardImagePath ? env.publicImgUrl + data.barCardImagePath : '';
          this.nationalIDImageUrl = data.nationalIDImagePath ? env.publicImgUrl + data.nationalIDImagePath : '';
        },
        error: (err) => {
          console.error('Error loading lawyer:', err);
        }
      });
    }
  }
  

  approveLawyer() {
    this.adminService.approveLawyer(this.lawyer.id).subscribe(() => {
      this.router.navigate(['/dashboard/admin-dashboard/pending-lawyers']);
    });
  }

  backToList() {
    this.router.navigate(['/dashboard/admin-dashboard/pending-lawyers']);
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // // Optional: Validate file type and size
      // if (!['image/jpeg', 'image/png'].includes(file.type)) {
      //   // Show error message if needed
      //   return;
      // }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        // Show error message if needed
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.lawyerImageUrl = e.target.result;
        // If you have a form, patch the value:
        this.lawyerForm.patchValue({ imageUrl: this.lawyerImageUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  onBarCardImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.barCardImageUrl = e.target.result;
        this.lawyerForm.patchValue({ barCardImage: this.barCardImageUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  onNationalIDImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nationalIDImageUrl = e.target.result;
        this.lawyerForm.patchValue({ nationalIDImage: this.nationalIDImageUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.lawyerForm.invalid) {
      this.lawyerForm.markAllAsTouched();
      return;
    }
    const payload = this.lawyerForm.value;
    // Call your service to send payload to backend
  }

  extractFileName(path: string): string {
    return path ? path.split('\\').pop() || '' : '';
  }
}