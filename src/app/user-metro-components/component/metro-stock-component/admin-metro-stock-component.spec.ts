import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroStockComponent } from './admin-metro-stock-component';

describe('AdminMetroStockComponent', () => {
  let component: AdminMetroStockComponent;
  let fixture: ComponentFixture<AdminMetroStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroStockComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
