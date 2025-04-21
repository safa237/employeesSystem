import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeesService } from 'src/app/shared/services/employees/employees.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-get-employees',
  templateUrl: './get-employees.component.html',
  styleUrls: ['./get-employees.component.scss']
})
export class GetEmployeesComponent implements OnInit, OnDestroy {
  employees: any[] = [];
  totalEmployees: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  maxEmployees: number = 30;
  visibleCardIndex: number | null = null;
  showModal: boolean = false;
  employeeToDelete: any = null;
  searchQuery: string = '';
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  constructor(
    private employeeService: EmployeesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.fetchEmployees();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  setupSearch(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), 
        distinctUntilChanged() 
      )
      .subscribe((query) => {
        if (query.trim().length === 0) {
          this.resetSearch();
        } else {
          this.performSearch(query);
        }
      });
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  performSearch(query: string): void {
    this.isSearching = true;
    this.employeeService.searchEmployees(query).subscribe({
      next: (res: any) => {
        this.employees = res.users;
        this.totalEmployees = this.employees.length;
        this.totalPages = 1;
        this.pageNumbers = [1];
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.employees = [];
        this.totalEmployees = 0;
        this.totalPages = 0;
      }
    });
  }

  fetchEmployees(): void {
    const skip = (this.currentPage - 1) * this.pageSize;
    this.employeeService.getEmployeesWithPagination(this.pageSize, skip).subscribe({
      next: (res: any) => {
        this.employees = [...this.employees, ...res.users];
        this.totalEmployees = Math.min(res.total, this.maxEmployees);
        this.totalPages = Math.ceil(this.totalEmployees / this.pageSize);
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        if (this.employees.length >= this.maxEmployees) {
          this.employees = this.employees.slice(0, this.maxEmployees);
          this.totalPages = Math.ceil(this.employees.length / this.pageSize);
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      error: (err) => {
        console.error('Failed to fetch employees:', err);
      }
    });
  }

  goToPage(page: number): void {
    if (page !== this.currentPage && this.employees.length < this.maxEmployees) {
      this.currentPage = page;
      this.fetchEmployees();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchEmployees();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages && this.employees.length < this.maxEmployees) {
      this.currentPage++;
      this.fetchEmployees();
    }
  }

  toggleDiv(index: number): void {
    this.visibleCardIndex = this.visibleCardIndex === index ? null : index;
  }

  openDeleteModal(employee: any): void {
    this.employeeToDelete = employee;
    this.showModal = true;
    this.visibleCardIndex = null;
  }

  confirmDelete(): void {
    if (this.employeeToDelete) {
      this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe({
        next: () => {
          this.employees = this.employees.filter(emp => emp.id !== this.employeeToDelete.id);
          this.totalEmployees = Math.min(this.totalEmployees - 1, this.maxEmployees);
          this.closeModal();
          console.log("employee deleted");
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
          this.closeModal();
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.employeeToDelete = null;
  }

  viewEmployeeDetails(employeeId: number): void {
    this.router.navigate(['/employees/employee', employeeId]);
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/add-employee']);
  }

  resetSearch(): void {
    this.isSearching = false;
    this.searchQuery = '';
    this.currentPage = 1;
    this.employees = [];
    this.fetchEmployees();
  }
}