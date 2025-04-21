import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetEmployeesRoutingModule } from './get-employees-routing.module';
import { GetEmployeesComponent } from './get-employees.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@NgModule({
  declarations: [
    GetEmployeesComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    GetEmployeesRoutingModule,
    FormsModule
  ]
})
export class GetEmployeesModule { }
