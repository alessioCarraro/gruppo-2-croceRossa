import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliverySuccessComponent } from './delivery-success-component';

describe('DeliverySuccessComponent', () => {
  let component: DeliverySuccessComponent;
  let fixture: ComponentFixture<DeliverySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverySuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliverySuccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
