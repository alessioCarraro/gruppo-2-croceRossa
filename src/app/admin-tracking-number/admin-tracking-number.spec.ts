import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTrackingNumber } from './admin-tracking-number';

describe('AdminTrackingNumber', () => {
  let component: AdminTrackingNumber;
  let fixture: ComponentFixture<AdminTrackingNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrackingNumber],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTrackingNumber);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
