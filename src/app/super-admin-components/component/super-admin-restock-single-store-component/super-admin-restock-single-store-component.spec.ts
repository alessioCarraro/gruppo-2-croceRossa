import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminRestockSingleStoreComponent } from './super-admin-restock-single-store-component';

describe('SuperAdminRestockSingleStoreComponent', () => {
  let component: SuperAdminRestockSingleStoreComponent;
  let fixture: ComponentFixture<SuperAdminRestockSingleStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminRestockSingleStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminRestockSingleStoreComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
