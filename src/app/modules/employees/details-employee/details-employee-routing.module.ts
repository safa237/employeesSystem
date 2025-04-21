import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsEmployeeComponent } from './details-employee.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsEmployeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsEmployeeRoutingModule { }
