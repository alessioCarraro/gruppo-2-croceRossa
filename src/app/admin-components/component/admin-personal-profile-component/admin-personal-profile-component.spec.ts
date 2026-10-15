import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPersonalProfileComponent } from './admin-personal-profile-component';

describe('AdminPersonalProfileComponent', () => {
  let component: AdminPersonalProfileComponent;
  let fixture: ComponentFixture<AdminPersonalProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPersonalProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPersonalProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
