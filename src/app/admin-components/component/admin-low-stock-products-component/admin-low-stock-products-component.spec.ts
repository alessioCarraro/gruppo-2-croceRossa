import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLowStockProductsComponent } from './admin-low-stock-products-component';

describe('AdminLowStockProductsComponent', () => {
  let component: AdminLowStockProductsComponent;
  let fixture: ComponentFixture<AdminLowStockProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLowStockProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLowStockProductsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
