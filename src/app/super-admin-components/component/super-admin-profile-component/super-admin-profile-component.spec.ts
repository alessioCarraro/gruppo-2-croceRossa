import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminProfileComponent } from './super-admin-profile-component';

describe('SuperAdminProfileComponent', () => {
  let component: SuperAdminProfileComponent;
  let fixture: ComponentFixture<SuperAdminProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
