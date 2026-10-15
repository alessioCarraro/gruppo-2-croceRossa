import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductCatalogComponent } from './admin-product-catalog-component';

describe('AdminProductCatalogComponent', () => {
  let component: AdminProductCatalogComponent;
  let fixture: ComponentFixture<AdminProductCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductCatalogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});