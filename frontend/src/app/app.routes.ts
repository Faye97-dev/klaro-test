import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'beneficiary',
    pathMatch: 'full',
  },
  {
    path: 'beneficiary',
    loadComponent: () =>
      import('./pages/beneficiary/beneficiary.component').then(
        (m) => m.BeneficiaryComponent,
      ),
  },
  {
    path: 'manager',
    loadComponent: () =>
      import('./pages/manager/manager.component').then(
        (m) => m.ManagerComponent,
      ),
  },
];
