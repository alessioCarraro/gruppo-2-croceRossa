import { Component } from '@angular/core';
import { LoginComponent } from './user-components/component/login-component/login-component';
import { ScannerComponent } from './user-components/component/scanner-component/scanner-component';
import { QrScannerComponent } from './user-components/component/scanner1-component/scanner1-component';
import { PersonProfileComponent } from './user-components/component/person-profile-component/person-profile-component';
import { ProductCatalogComponent } from './user-components/component/product-catalog-component/product-catalog-component';
import { ExitComponent } from './user-components/exit-component/exit-component';
import { SummaryComponent } from './user-components/component/summary-component/summary-component';
import { HomeComponent } from './user-components/component/home-component/home-component';
import { DeliverySuccessComponent } from './user-components/component/delivery-success-component/delivery-success-component';
import { StoreLocatorComponent } from './user-components/component/store-locator-component/store-locator-component';
import { LocalWarehouseComponent } from './user-components/component/local-warehouse-component/local-warehouse-component';
import { PersonProfileNotokenComponent } from './user-components/component/person-profile-notoken/person-profile-notoken';
import { RouterOutlet } from '@angular/router';
import { AdminHomeComponent } from './admin-components/component/admin-home-component/admin-home-component';
import { RequestsComponent } from './admin-components/component/admin-requests-component/admin-requests-component';
import { AdminPersonProfileComponent } from './admin-components/component/admin-personal-profile-component/admin-personal-profile-component';
import { AdminQrScannerComponent } from './admin-components/component/admin-qr-scanner-component/admin-qr-scanner-component';
import { AdminTrackingNumberComponent } from './admin-components/component/admin-tracking-number/admin-tracking-number';
import { LowStockComponent } from './admin-components/component/admin-low-stock-products-component/admin-low-stock-products-component';
import { AdminStoreLocatorComponent } from './admin-components/component/admin-stor-locator-component/admin-stor-locator-component';
import { ExpiringProductsComponent } from './admin-components/component/expiring-products-component/expiring-products-component';
import { UserMetroDashboardComponent } from './user-metro-components/component/admin-metro-dashboard-component/user-metro-dashboard-component';
import { AdminMetroProfileComponent } from './user-metro-components/component/admin-metro-profile/admin-metro-profile';
import { AdminMetroStockComponent } from './user-metro-components/component/admin-metro-stock-component/admin-metro-stock-component';
import { AdminMetroExpiringProductsComponent } from './user-metro-components/component/admin-metro-expiring-products-component/admin-metro-expiring-products-component';
import { AdminMetroAdminLocationsComponent } from './user-metro-components/component/admin-metro-admin-locations/admin-metro-admin-locations';
import { AdminMetroUserLocationsComponent } from './user-metro-components/component/admin-metro-user-locations/admin-metro-user-locations';
import { AdminMetroLoadItemComponent } from './user-metro-components/component/admin-metro-load-item-component/admin-metro-load-item-component';
import { AdminMetroAddExistingItemComponent } from './user-metro-components/component/admin-metro-add-existing-item-component/admin-metro-add-existing-item-component';
import { AdminMetroAddNewItemComponent } from './user-metro-components/component/admin-metro-add-new-item-component/admin-metro-add-new-item-component';
import { AdminMetroRestockComponent } from './user-metro-components/component/admin-metro-restock-component/admin-metro-restock-component';
import { AdminMetroRestockSingleStoreComponent } from './user-metro-components/component/admin-metro-restock-sigle-store-component/admin-metro-restock-sigle-store-component';
import { AdminMetroRestockSummary } from './user-metro-components/component/admin-metro-restock-summary/admin-metro-restock-summary';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, LoginComponent, ScannerComponent, QrScannerComponent, PersonProfileComponent, ProductCatalogComponent, ExitComponent, SummaryComponent, 
    DeliverySuccessComponent, HomeComponent, PersonProfileNotokenComponent, StoreLocatorComponent, LocalWarehouseComponent, AdminHomeComponent, 
    RequestsComponent, AdminPersonProfileComponent, AdminQrScannerComponent, AdminTrackingNumberComponent, AdminTrackingNumberComponent, LowStockComponent,
    AdminStoreLocatorComponent, ExpiringProductsComponent, UserMetroDashboardComponent, AdminMetroProfileComponent, AdminMetroStockComponent,
    AdminMetroExpiringProductsComponent, AdminMetroAdminLocationsComponent, AdminMetroUserLocationsComponent, AdminMetroLoadItemComponent,
    AdminMetroAddExistingItemComponent, AdminMetroAddNewItemComponent, AdminMetroRestockComponent, AdminMetroRestockComponent, AdminMetroRestockSingleStoreComponent,
     AdminMetroRestockSummary
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
} 
