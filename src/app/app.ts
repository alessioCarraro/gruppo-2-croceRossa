import { Component } from '@angular/core';
import { LoginComponent } from './component/login-component/login-component';
import { ScannerComponent } from './component/scanner-component/scanner-component';
import { QrScannerComponent } from './component/scanner1-component/scanner1-component';
import { PersonProfileComponent } from './component/person-profile-component/person-profile-component';
import { ProductCatalogComponent } from './component/product-catalog-component/product-catalog-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, ScannerComponent, QrScannerComponent, PersonProfileComponent, ProductCatalogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
