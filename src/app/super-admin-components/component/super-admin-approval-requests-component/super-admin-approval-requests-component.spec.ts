import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminApprovalRequestsComponent } from './super-admin-approval-requests-component';

describe('SuperAdminApprovalRequestsComponent', () => {
  let component: SuperAdminApprovalRequestsComponent;
  let fixture: ComponentFixture<SuperAdminApprovalRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminApprovalRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminApprovalRequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
