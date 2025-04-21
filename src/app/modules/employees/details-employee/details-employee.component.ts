import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from 'src/app/shared/services/employees/employees.service';

@Component({
  selector: 'app-details-employee',
  templateUrl: './details-employee.component.html',
  styleUrls: ['./details-employee.component.scss']
})
export class DetailsEmployeeComponent implements OnInit {
  employeeDetails: any = null;
  isEditable: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.fetchEmployeeDetails(employeeId);
    }
  }

  fetchEmployeeDetails(id: string): void {
    this.employeesService.getEmployeeDetails(id).subscribe({
      next: (response: any) => {
        this.employeeDetails = {
          ...response,
          company: response.company || { name: '', title: '', department: '' },
          address: response.address || { address: '', city: '' }
        };
      },
      error: (err) => {
        console.error('Failed to fetch employee details:', err);
        this.errorMessage = 'Failed to load employee details';
      }
    });
  }

  toggleEdit(): void {
    this.isEditable = !this.isEditable;
    this.errorMessage = null;
  }

  saveChanges(): void {
    if (this.employeeDetails) {
      const updateData = {
        firstName: this.employeeDetails.firstName,
        lastName: this.employeeDetails.lastName,
        email: this.employeeDetails.email,
        password: this.employeeDetails.password,
        phone: this.employeeDetails.phone,
        age: this.employeeDetails.age,
        address: {
          address: this.employeeDetails.address.address,
          city: this.employeeDetails.address.city
        },
        company: {
          department: this.employeeDetails.company.department,
          title: this.employeeDetails.company.title
        }
      };

      this.employeesService.updateEmployee(this.employeeDetails.id, updateData).subscribe({
        next: (response) => {
          this.employeeDetails = {
            ...response,
            company: response.company || { name: '', title: '', department: '' },
            address: response.address || { address: '', city: '' }
          };
          this.isEditable = false;
          this.errorMessage = null;
          console.log("updated succefully " )
        },
        error: (err) => {
          console.error('Failed to update employee:', err);
          this.errorMessage = 'Failed to update employee details';
        }
      });
    }
  }
}