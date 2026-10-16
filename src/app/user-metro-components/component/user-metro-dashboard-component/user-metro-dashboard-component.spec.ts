import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMetroDashboardComponent } from './user-metro-dashboard-component';

describe('UserMetroDashboardComponent', () => {
  let component: UserMetroDashboardComponent;
  let fixture: ComponentFixture<UserMetroDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMetroDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMetroDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
