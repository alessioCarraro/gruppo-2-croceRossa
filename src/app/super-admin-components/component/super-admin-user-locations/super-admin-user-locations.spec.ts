import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminUserLocations } from './super-admin-user-locations';

describe('SuperAdminUserLocations', () => {
  let component: SuperAdminUserLocations;
  let fixture: ComponentFixture<SuperAdminUserLocations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminUserLocations],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminUserLocations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
