import { Routes } from '@angular/router';
import { LoginComponent } from './user-components/login-component/login-component';
import { HomeComponent } from './user-components/home-component/home-component';
import { LocalWarehouseComponent } from './user-components/local-warehouse-component/local-warehouse-component';
import { StoreLocatorComponent } from './user-components/store-locator-component/store-locator-component';
import { PersonProfileComponent } from './user-components/person-profile-component/person-profile-component';
import { PersonProfileNotokenComponent } from './user-components/person-profile-notoken/person-profile-notoken';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'warehouse', component: LocalWarehouseComponent },
  { path: 'store-locator', component: StoreLocatorComponent },
  { path: 'person-profile', component: PersonProfileComponent },
  { path: 'person-profile-no-token', component: PersonProfileNotokenComponent },
  { path: '**', redirectTo: 'login' }
];