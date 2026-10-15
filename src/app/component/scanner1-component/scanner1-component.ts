import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scanner1-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner1-component.html',
  styleUrls: ['./scanner1-component.css']
})
export class QrScannerComponent {}
