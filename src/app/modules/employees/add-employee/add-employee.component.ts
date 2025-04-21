import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeesService } from 'src/app/shared/services/employees/employees.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  submitted = false;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      age: ['', [Validators.required, Validators.min(18)]],
      department: ['', Validators.required],
      title: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      this.employeeForm.patchValue({ image: file });
      this.employeeForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.employeeForm.value.firstName);
    formData.append('lastName', this.employeeForm.value.lastName);
    formData.append('email', this.employeeForm.value.email);
    formData.append('password', this.employeeForm.value.password);
    formData.append('phone', this.employeeForm.value.phone);
    formData.append('age', this.employeeForm.value.age.toString());
    formData.append('address', this.employeeForm.value.address);
    formData.append('city', this.employeeForm.value.city);
    formData.append('department', this.employeeForm.value.department);
    formData.append('title', this.employeeForm.value.title);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.employeesService.addEmployee(formData).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err) => {
        console.error('Error adding employee:', err);
        alert('Failed to add employee. Please try again.');
      }
    });
  }
}
