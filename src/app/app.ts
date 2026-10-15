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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, ScannerComponent, QrScannerComponent, PersonProfileComponent, ProductCatalogComponent, ExitComponent, SummaryComponent, DeliverySuccessComponent, HomeComponent, PersonProfileNotokenComponent, StoreLocatorComponent, LocalWarehouseComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
} 
