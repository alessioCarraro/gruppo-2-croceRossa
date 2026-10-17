import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminRequestDitailsComponent } from './super-admin-request-details-component';

describe('SuperAdminRequestDitailsComponent', () => {
  let component: SuperAdminRequestDitailsComponent;
  let fixture: ComponentFixture<SuperAdminRequestDitailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminRequestDitailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminRequestDitailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
