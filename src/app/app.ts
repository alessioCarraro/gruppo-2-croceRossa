import { Component } from '@angular/core';
import { LoginComponent } from './component/login-component/login-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
