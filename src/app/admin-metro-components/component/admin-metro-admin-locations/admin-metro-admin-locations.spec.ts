import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroAdminLocations } from './admin-metro-admin-locations';

describe('AdminMetroAdminLocations', () => {
  let component: AdminMetroAdminLocations;
  let fixture: ComponentFixture<AdminMetroAdminLocations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroAdminLocations],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroAdminLocations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
