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
import { AdminMetroProfileComponent } from './user-metro-components/component/admin-metro-profile/admin-metro-profile';
import { SuperAdminProfileComponent } from './super-admin-components/component/super-admin-profile-component/super-admin-profile-component';
import { SuperAdminMetroStockComponent } from './super-admin-components/component/super-admin-metro-stock/super-admin-metro-stock';
import { SuperAdminLoadItemComponent } from './super-admin-components/component/super-admin-load-item-component/super-admin-load-item-component';
import { SuperAdminApprovalRequestsComponent } from './super-admin-components/component/super-admin-approval-requests-component/super-admin-approval-requests-component';
import { SuperAdminExpiringProductsComponent } from './super-admin-components/component/super-admin-expiring-products-component/super-admin-expiring-products-component';
import { SuperAdminRestoockComponent } from './super-admin-components/component/super-admin-restoock-component/super-admin-restoock-component';
import { SuperAdminAdminLocationsComponent } from './super-admin-components/component/super-admin-admin-locations/super-admin-admin-locations';
import { SuperAdminUserLocationsComponent } from './super-admin-components/component/super-admin-user-locations/super-admin-user-locations';
import { AdminMetroStockComponent } from './user-metro-components/component/admin-metro-stock-component/admin-metro-stock-component';

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

  // Rotte admin
  { path: 'admin-metro-profile', component: AdminMetroProfileComponent },
  { path: 'admin-metro-stock', component: AdminMetroStockComponent },
  
  // Rotte Super Admin
  { path: 's-admin-profile', component: SuperAdminProfileComponent },
  { path: 's-admin-metro-stock', component: SuperAdminMetroStockComponent },
  { path: 's-admin-load-item', component: SuperAdminLoadItemComponent },
  { path: 's-admin-restock', component: SuperAdminRestoockComponent },
  { path: 's-admin-approval-requests', component: SuperAdminApprovalRequestsComponent },
  { path: 's-admin-expiring-products', component: SuperAdminExpiringProductsComponent },
  { path: 's-admin-admin-locations', component: SuperAdminAdminLocationsComponent },
  { path: 's-admin-user-locations', component: SuperAdminUserLocationsComponent },

  { path: '**', redirectTo: 'login' }
];