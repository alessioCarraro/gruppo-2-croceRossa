import { Routes } from '@angular/router';
import { LoginComponent } from './user-components/component/login-component/login-component';
import { HomeComponent } from './user-components/component/home-component/home-component';
import { LocalWarehouseComponent } from './user-components/component/local-warehouse-component/local-warehouse-component';
import { StoreLocatorComponent } from './user-components/component/store-locator-component/store-locator-component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'warehouse', component: LocalWarehouseComponent },
  {path: 'store-locator', component: StoreLocatorComponent},
  { path: '**', redirectTo: 'login' }
];