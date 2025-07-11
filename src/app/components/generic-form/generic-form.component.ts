import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LawyerService } from '../../core/services/lawyer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css',
})
export class GenericFormComponent {
  constructor(private fb: FormBuilder, private lawyerService: LawyerService) {}

  registerForm!: FormGroup;
  @Input() formFields: any[] = [];
  @Input() onSubmitFn!: (data: any) => void;
  @Input() data!: any;

  ngOnInit(): void {
    const group: any = {};
    console.log(this.data);
    this.formFields.forEach((field) => {
      group[field.name] = [this.data[field.name] || '', field.validators];
    });

    this.registerForm = this.fb.group(group);
  }
  onSubmit() {
    console.log(this.registerForm.value);
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid && this.onSubmitFn) {
      this.onSubmitFn(this.registerForm.value);
    }
  }

  getErrorKeys(controlName: string): string[] {
    const control = this.registerForm.get(controlName);
    return control && control.errors ? Object.keys(control.errors) : [];
  }
}
