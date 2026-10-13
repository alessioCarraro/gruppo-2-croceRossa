import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-bar',
  standalone: true,
  template: `<header class="topbar"><div class="brand"><span class="mark">✚</span><span><b>FOOD NETWORK</b><small>AID PROJECT</small></span></div><span class="role">{{ role() }}</span></header>`,
  styles: [`.topbar{height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid #ded7c9;background:#fff}.brand{display:flex;align-items:center;gap:8px;color:#12567d}.brand .mark{display:grid;place-items:center;width:28px;height:28px;border-radius:7px;background:#12567d;color:#fff;font-size:18px}.brand b,.brand small{display:block;line-height:1}.brand b{font:800 12px Archivo}.brand small{font:700 8px Montserrat;letter-spacing:.16em;color:#4f9bc0;margin-top:3px}.role{font-size:11px;font-weight:800;color:#12567d;background:#e1eef6;padding:5px 9px;border-radius:999px}`],
  encapsulation: ViewEncapsulation.None,
})
export class AppBarComponent {
  readonly role = input('ADMIN');
}
