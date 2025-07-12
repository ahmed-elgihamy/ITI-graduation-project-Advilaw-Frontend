import { LawyerService } from './../../core/services/lawyer.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-edit-lawyer-profile',
  imports: [GenericFormComponent, CommonModule],
  templateUrl: './edit-lawyer-profile.component.html',
  styleUrl: './edit-lawyer-profile.component.css',
})
export class EditLawyerProfileComponent implements OnInit {
  registerForm!: FormGroup;
  lawyerDetails: any = {};
  isDataLoaded = false;

  constructor(
    private lawyerService: LawyerService,
    private router: Router,
    private authService: AuthService
  ) {}
  formFields = [
    {
      name: 'userName',
      label: 'Username',
      type: 'text',
      validators: [Validators.required],
      errors: {
        required: 'Username is required.',
      },
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'text',
      validators: [Validators.required],
      errors: {
        required: 'Bio is required.',
      },
    },
    {
      name: 'profileHeader',
      label: 'Profile Header',
      type: 'text',
      validators: [Validators.required],
      errors: {
        required: 'Profile header is required.',
      },
    },
    {
      name: 'profileAbout',
      label: 'About',
      type: 'text',
      validators: [Validators.required],
      errors: {
        required: 'Profile about section is required.',
      },
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      validators: [Validators.required],
      errors: {
        required: 'City is required.',
      },
    },
    {
      name: 'country',
      label: 'Country',
      type: 'text',
      validators: [Validators.required],
      errors: {
        required: 'Country is required.',
      },
    },
    {
      name: 'countryCode',
      label: 'Country Code',
      type: 'text',
      validators: [Validators.required, Validators.pattern(/^[A-Z]{2}$/)],
      errors: {
        required: 'Country code is required.',
        pattern: 'Country code must be 2 uppercase letters (e.g. EG, US).',
      },
    },
    {
      name: 'postalCode',
      label: 'Postal Code',
      type: 'text',
      validators: [Validators.required],
      errors: {
        required: 'Postal Code is required.',
      },
    },
    {
      name: 'nationalityId',
      label: 'National ID',
      type: 'text',
      validators: [Validators.required, Validators.pattern(/^\d{14}$/)],
      errors: {
        required: 'National ID is required.',
        pattern: 'National ID must be 14 digits.',
      },
    },
    // {
    //   name: 'barAssociationCardNumber',
    //   label: 'Bar Card Number',
    //   type: 'text',
    //   validators: [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)],
    //   errors: {
    //     required: 'Bar card number is required.',
    //     pattern: 'Bar card number must be 5 or 6 digits.',
    //   },
    // },
    {
      name: 'hourlyRate',
      label: 'Hourly Rate',
      type: 'number',
      validators: [Validators.required, Validators.min(1)],
      errors: {
        required: 'Hourly rate is required.',
        min: 'Hourly rate must be greater than 0.',
      },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['Male', 'Female'],
      validators: [Validators.required],
      errors: {
        required: 'Gender is required.',
      },
    },
  ];

  ngOnInit(): void {
    this.lawyerService.GetLawyerDetails().subscribe({
      next: (res) => {
        console.log(res);
        this.lawyerDetails = res;
        this.isDataLoaded = true;
        console.log(this.lawyerDetails);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleSubmit = (formValue: any) => {
    this.lawyerService.editLawyerProfile(formValue).subscribe({
      next: (res) => {
        console.log('hello');
        console.log(this.lawyerDetails.userId);
        this.router.navigate(['/profile', this.lawyerDetails.userId]);
      },
      error: (err) => console.error(err),
    });
  };
}
