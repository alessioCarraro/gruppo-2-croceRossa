import { Routes } from '@angular/router';
import { LoginComponent } from './user-components/login-component/login-component';
import { HomeComponent } from './user-components/home-component/home-component';
import { LocalWarehouseComponent } from './user-components/local-warehouse-component/local-warehouse-component';
import { StoreLocatorComponent } from './user-components/store-locator-component/store-locator-component';
import { PersonProfileComponent } from './user-components/person-profile-component/person-profile-component';
import { PersonProfileNotokenComponent } from './user-components/person-profile-notoken/person-profile-notoken';
import { ProductCatalogComponent } from './user-components/product-catalog-component/product-catalog-component';
import { SummaryComponent } from './user-components/summary-component/summary-component';
import { DeliverySuccessComponent } from './user-components/delivery-success-component/delivery-success-component';
import { AdminHomeComponent } from './admin-components/component/admin-home-component/admin-home-component';
import { SuperAdminDashboardComponent } from './super-admin-components/component/super-admin-dashboard/super-admin-dashboard';
import { UserMetroDashboardComponent } from './user-metro-components/component/admin-metro-dashboard-component/user-metro-dashboard-component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'user-home', component: HomeComponent },
  { path: 'user-metro-dashboard', component: UserMetroDashboardComponent },
  { path: 'admin-home', component: AdminHomeComponent },
  { path: 's-admin-home', component: SuperAdminDashboardComponent },
  { path: 'warehouse', component: LocalWarehouseComponent },
  { path: 'store-locator', component: StoreLocatorComponent },
  { path: 'person-profile', component: PersonProfileComponent },
  { path: 'person-profile-no-token', component: PersonProfileNotokenComponent },
  { path: 'product-catalog', component: ProductCatalogComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'delivery-success', component: DeliverySuccessComponent },
  { path: '**', redirectTo: 'login' }
];