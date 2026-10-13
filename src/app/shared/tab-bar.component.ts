import { Component, inject } from '@angular/core';
import { App } from '../app';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  template: `<nav class="tabbar"><button [class.active]="app.screen()==='dashboard'" (click)="app.go('dashboard')"><span class="tab-icon home-icon"></span><small>Home</small></button><button [class.active]="app.screen()==='identify' || app.screen()==='person' || app.screen()==='delivery' || app.screen()==='summary' || app.screen()==='success'" (click)="app.go('identify')"><span class="tab-icon scan-icon"></span><small>Scansione</small></button><button [class.active]="app.screen()==='catalog' || app.screen()==='order' || app.screen()==='packages' || app.screen()==='arrived' || app.screen()==='transit' || app.screen()==='low' || app.screen()==='expiry'" (click)="app.go('catalog')"><span class="tab-icon warehouse-icon"></span><small>Magazzino</small></button><button [class.active]="app.screen()==='sites'" (click)="app.go('sites')"><span class="tab-icon map-icon"></span><small>Altre sedi</small></button><button [class.active]="app.screen()==='approvals'" (click)="app.go('approvals')"><span class="tab-icon approval-tab-icon"></span><small>Approvazioni</small></button></nav>`,
})
export class TabBarComponent {
  protected readonly app = inject(App);
}
