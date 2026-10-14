import { Component } from '@angular/core';
import { LoginComponent } from './component/login-component/login-component';
import { ScannerComponent } from './component/scanner-component/scanner-component';

@Component({
  selector: 'app-root',
  imports: [LoginComponent, ScannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
