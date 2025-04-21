import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetEmployeesComponent } from './get-employees.component';

const routes: Routes = [
  { path: '', component: GetEmployeesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetEmployeesRoutingModule { }
