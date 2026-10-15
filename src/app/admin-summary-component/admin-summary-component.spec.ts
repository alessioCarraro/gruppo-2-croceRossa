import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSummaryComponent } from './admin-summary-component';

describe('AdminSummaryComponent', () => {
  let component: AdminSummaryComponent;
  let fixture: ComponentFixture<AdminSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
