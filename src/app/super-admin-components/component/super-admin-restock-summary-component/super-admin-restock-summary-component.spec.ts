import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminRestockSummaryComponent } from './super-admin-restock-summary-component';

describe('SuperAdminRestockSummaryComponent', () => {
  let component: SuperAdminRestockSummaryComponent;
  let fixture: ComponentFixture<SuperAdminRestockSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminRestockSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminRestockSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
