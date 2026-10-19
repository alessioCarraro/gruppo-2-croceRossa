import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroExpiringProductsComponent } from './admin-metro-expiring-products-component';

describe('AdminMetroExpiringProductsComponent', () => {
  let component: AdminMetroExpiringProductsComponent;
  let fixture: ComponentFixture<AdminMetroExpiringProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroExpiringProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroExpiringProductsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
