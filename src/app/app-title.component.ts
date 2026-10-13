import { Component, input } from '@angular/core';
import { App, Screen } from './app';
@Component({ selector: 'app-title', standalone: true, template: `<div class="app-title"><button class="back" (click)="app.go(back())">‹</button><h1>{{title()}}</h1>@if (count()) {<span class="chip info">{{count()}}</span>} @if (badge()) {<span class="chip ok">{{badge()}}</span>}</div>` })
export class AppTitleComponent { readonly title = input(''); readonly back = input<Screen>('dashboard'); readonly count = input<string | number>(''); readonly badge = input<string | number>(''); constructor(public app: App) {} }
