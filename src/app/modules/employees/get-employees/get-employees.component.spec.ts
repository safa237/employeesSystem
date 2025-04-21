import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEmployeesComponent } from './get-employees.component';

describe('GetEmployeesComponent', () => {
  let component: GetEmployeesComponent;
  let fixture: ComponentFixture<GetEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetEmployeesComponent]
    });
    fixture = TestBed.createComponent(GetEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
