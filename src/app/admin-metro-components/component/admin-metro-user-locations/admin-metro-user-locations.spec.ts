import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroUserLocations } from './admin-metro-user-locations';

describe('AdminMetroUserLocations', () => {
  let component: AdminMetroUserLocations;
  let fixture: ComponentFixture<AdminMetroUserLocations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroUserLocations],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroUserLocations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
