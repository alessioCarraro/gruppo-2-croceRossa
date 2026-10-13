import { Component, inject } from '@angular/core';
import { App } from '../app';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  template: `<nav class="tabbar"><button [class.active]="app.screen()==='dashboard'" (click)="app.go('dashboard')">⌂<small>Home</small></button><button (click)="app.go('identify')">▣<small>Scansione</small></button><button (click)="app.go('catalog')">▧<small>Magazzino</small></button><button (click)="app.go('sites')">⌘<small>Altre sedi</small></button><button (click)="app.go('approvals')">✓<small>Approvazioni</small></button></nav>`,
})
export class TabBarComponent {
  protected readonly app = inject(App);
}
