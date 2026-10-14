import { Component } from '@angular/core';
import { LoginComponent } from './component/login-component/login-component';
import { ScannerComponent } from './component/scanner-component/scanner-component';
import { QrScannerComponent } from './component/scanner1-component/scanner1-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, ScannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
