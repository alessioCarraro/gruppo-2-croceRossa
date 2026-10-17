import { Component } from '@angular/core';
import { LoginComponent } from './user-components/login-component/login-component';
import { ScannerComponent } from './user-components/component/scanner-component/scanner-component';
import { QrScannerComponent } from './user-components/component/scanner1-component/scanner1-component';
import { PersonProfileComponent } from './user-components/person-profile-component/person-profile-component';
import { ProductCatalogComponent } from './user-components/product-catalog-component/product-catalog-component';
import { ExitComponent } from './user-components/component/exit-component/exit-component';
import { SummaryComponent } from './user-components/summary-component/summary-component';
import { HomeComponent } from './user-components/home-component/home-component';
import { DeliverySuccessComponent } from './user-components/delivery-success-component/delivery-success-component';
import { StoreLocatorComponent } from './user-components/store-locator-component/store-locator-component';
import { LocalWarehouseComponent } from './user-components/local-warehouse-component/local-warehouse-component';
import { PersonProfileNotokenComponent } from './user-components/person-profile-notoken/person-profile-notoken';
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
import { AdminMetroRequestSentComponent } from './user-metro-components/component/admin-metro-request-sent-component/admin-metro-request-sent-component';
import { SuperAdminDashboardComponent } from './super-admin-components/component/super-admin-dashboard/super-admin-dashboard';
import { SuperAdminProfileComponent } from './super-admin-components/component/super-admin-profile-component/super-admin-profile-component';
import { SuperAdminMetroStockComponent } from './super-admin-components/component/super-admin-metro-stock/super-admin-metro-stock';
import { SuperAdminExpiringProductsComponent } from './super-admin-components/component/super-admin-expiring-products-component/super-admin-expiring-products-component';
import { SuperAdminAdminLocationsComponent } from './super-admin-components/component/super-admin-admin-locations/super-admin-admin-locations';
import { SuperAdminUserLocationsComponent } from './super-admin-components/component/super-admin-user-locations/super-admin-user-locations';
import { SuperAdminLoadItemComponent } from './super-admin-components/component/super-admin-load-item-component/super-admin-load-item-component';
import { SuperAdminAddExistingItemComponent } from './super-admin-components/component/super-admin-add-existing-item/super-admin-add-existing-item';
import { SuperAdminAddNewItemComponent } from './super-admin-components/component/super-admin-add-new-item-component/super-admin-add-new-item-component';
import { SuperAdminRestoockComponent } from './super-admin-components/component/super-admin-restoock-component/super-admin-restoock-component';
import { SuperAdminRestockSingleStoreComponent } from './super-admin-components/component/super-admin-restock-single-store-component/super-admin-restock-single-store-component';
import { SuperAdminRestockSummary } from './super-admin-components/component/super-admin-restock-summary-component/super-admin-restock-summary-component';
import { SuperAdminOrderSentConfirmationComponent } from './super-admin-components/component/super-admin-order-sent-confirmation-component/super-admin-order-sent-confirmation-component';
import { SuperAdminApprovalRequestsComponent } from './super-admin-components/component/super-admin-approval-requests-component/super-admin-approval-requests-component';
import { SuperAdminRequestDetailsComponent } from './super-admin-components/component/super-admin-request-details-component/super-admin-request-details-component';





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
     AdminMetroRestockSummary, AdminMetroRequestSentComponent, SuperAdminDashboardComponent, SuperAdminProfileComponent, SuperAdminMetroStockComponent,
     SuperAdminExpiringProductsComponent, SuperAdminAdminLocationsComponent, SuperAdminUserLocationsComponent, SuperAdminLoadItemComponent,
     SuperAdminAddExistingItemComponent, SuperAdminAddNewItemComponent, SuperAdminRestoockComponent, SuperAdminRestockSingleStoreComponent,
     SuperAdminRestockSummary, SuperAdminOrderSentConfirmationComponent, SuperAdminApprovalRequestsComponent, SuperAdminRequestDetailsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
} 
