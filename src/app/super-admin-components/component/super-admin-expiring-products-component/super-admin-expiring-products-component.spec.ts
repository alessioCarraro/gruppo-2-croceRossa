import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminExpiringProductsComponent } from './super-admin-expiring-products-component';

describe('SuperAdminExpiringProductsComponent', () => {
  let component: SuperAdminExpiringProductsComponent;
  let fixture: ComponentFixture<SuperAdminExpiringProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminExpiringProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminExpiringProductsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
