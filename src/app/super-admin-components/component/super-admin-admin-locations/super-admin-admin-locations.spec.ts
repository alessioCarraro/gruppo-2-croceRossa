import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminAdminLocations } from './super-admin-admin-locations';

describe('SuperAdminAdminLocations', () => {
  let component: SuperAdminAdminLocations;
  let fixture: ComponentFixture<SuperAdminAdminLocations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminAdminLocations],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminAdminLocations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
