import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroRestockSigleStoreComponent } from './admin-metro-restock-sigle-store-component';

describe('AdminMetroRestockSigleStoreComponent', () => {
  let component: AdminMetroRestockSigleStoreComponent;
  let fixture: ComponentFixture<AdminMetroRestockSigleStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroRestockSigleStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroRestockSigleStoreComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
