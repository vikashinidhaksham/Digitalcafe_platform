import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';

import { UserDashboard } from './user-dashboard/user-dashboard';
import { OwnerComponent } from './owner/owner';
import { DashboardComponent } from './dashboard/dashboard';
import { ChefDashboardComponent } from './chef-dashboard/chef-dashboard';
import { Waiter } from './waiter/waiter';
export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admin', component: Admin },
  { path: 'user-dashboard', component: UserDashboard },
{ path: 'dashboard', component: DashboardComponent },
  { path:'owner', component:OwnerComponent },
  { path:'chef-dashboard', component: ChefDashboardComponent },
{
  path: 'cafe/:id',
  loadComponent: () =>
    import('./cafe-details/cafe-details')
      .then(m => m.CafeDetailsComponent)
},
{
path:'waiter',
component:Waiter
}
];



