import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroRestockSummary } from './admin-metro-restock-summary';

describe('AdminMetroRestockSummary', () => {
  let component: AdminMetroRestockSummary;
  let fixture: ComponentFixture<AdminMetroRestockSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroRestockSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroRestockSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
