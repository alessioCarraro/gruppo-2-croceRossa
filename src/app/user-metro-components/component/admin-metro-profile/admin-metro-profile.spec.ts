import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroProfile } from './admin-metro-profile';

describe('AdminMetroProfile', () => {
  let component: AdminMetroProfile;
  let fixture: ComponentFixture<AdminMetroProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
