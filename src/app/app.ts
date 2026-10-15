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
import { AdminHomeComponent } from './admin-components/component/admin-home-component/admin-home-component';
import { RequestsComponent } from './admin-components/component/admin-requests-component/admin-requests-component';
import { AdminPersonProfileComponent } from './admin-components/component/admin-personal-profile-component/admin-personal-profile-component';
import { AdminQrScannerComponent } from './admin-components/component/admin-qr-scanner-component/admin-qr-scanner-component';
import { AdminProductCatalogComponent } from './admin-components/component/admin-product-catalog-component/admin-product-catalog-component';
import { AdminDeliverySuccessComponent } from './admin-components/component/admin-delivery-success-component/admin-delivery-success-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, ScannerComponent, QrScannerComponent, PersonProfileComponent, ProductCatalogComponent, ExitComponent, SummaryComponent, DeliverySuccessComponent, HomeComponent, PersonProfileNotokenComponent, StoreLocatorComponent, LocalWarehouseComponent, AdminHomeComponent, RequestsComponent, AdminPersonProfileComponent, AdminQrScannerComponent, AdminProductCatalogComponent, AdminDeliverySuccessComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
} 
