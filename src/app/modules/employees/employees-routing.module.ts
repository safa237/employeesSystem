import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';

const routes: Routes = [
  { path: '', component: EmployeesComponent 
    , 
    children: [
      { path: '', loadChildren: () => import('./get-employees/get-employees.module').then(m => m.GetEmployeesModule) },
      {
        path: 'employee/:id', loadChildren: () => import('./details-employee/details-employee.module').then(m => m.DetailsEmployeeModule)
      },
      {
        path: 'add-employee', loadChildren: () => import('./add-employee/add-employee.module').then(m => m.AddEmployeeModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {}
