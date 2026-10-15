import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDeliverySuccessComponent } from './admin-delivery-success-component';

describe('AdminDeliverySuccessComponent', () => {
  let component: AdminDeliverySuccessComponent;
  let fixture: ComponentFixture<AdminDeliverySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeliverySuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDeliverySuccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});