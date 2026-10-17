import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminOrderSentConfirmationComponent } from './super-admin-order-sent-confirmation-component';

describe('SuperAdminOrderSentConfirmationComponent', () => {
  let component: SuperAdminOrderSentConfirmationComponent;
  let fixture: ComponentFixture<SuperAdminOrderSentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminOrderSentConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminOrderSentConfirmationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
