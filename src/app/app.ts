import { Component } from '@angular/core';
import { LoginComponent } from './component/login-component/login-component';
import { ScannerComponent } from './component/scanner-component/scanner-component';
import { QrScannerComponent } from './component/scanner1-component/scanner1-component';
import { PersonProfileComponent } from './component/person-profile-component/person-profile-component';
import { ProductCatalogComponent } from './component/product-catalog-component/product-catalog-component';
import { ExitComponent } from './component/exit-component/exit-component';
import { SummaryComponent } from './component/summary-component/summary-component';
import { HomeComponent } from './component/home-component/home-component';
import { DeliverySuccessComponent } from './component/delivery-success-component/delivery-success-component';
import { PersonalProfileNotokenComponent } from './component/person-profile-notoken/person-profile-notoken';
import { StoreLocatorComponent } from './component/store-locator-component/store-locator-component';
import { LocalWarehouseComponent } from './component/local-warehouse-component/local-warehouse-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, ScannerComponent, QrScannerComponent, PersonProfileComponent, ProductCatalogComponent, ExitComponent, SummaryComponent, DeliverySuccessComponent, HomeComponent, PersonalProfileNotokenComponent, StoreLocatorComponent, LocalWarehouseComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
