import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminRestoockComponent } from './super-admin-restoock-component';

describe('SuperAdminRestoockComponent', () => {
  let component: SuperAdminRestoockComponent;
  let fixture: ComponentFixture<SuperAdminRestoockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminRestoockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminRestoockComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
