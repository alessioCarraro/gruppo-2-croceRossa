import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTrackingNumberDitailsComponent } from './admin-tracking-number-ditails-component';

describe('AdminTrackingNumberDitailsComponent', () => {
  let component: AdminTrackingNumberDitailsComponent;
  let fixture: ComponentFixture<AdminTrackingNumberDitailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrackingNumberDitailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTrackingNumberDitailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
