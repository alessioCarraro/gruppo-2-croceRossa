import { Routes } from '@angular/router';
import { LoginComponent } from './user-components/component/login-component/login-component';
import { HomeComponent } from './user-components/component/home-component/home-component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'login' }
];
