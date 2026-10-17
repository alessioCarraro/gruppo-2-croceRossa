import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminLoadItemComponent } from './super-admin-load-item-component';

describe('SuperAdminLoadItemComponent', () => {
  let component: SuperAdminLoadItemComponent;
  let fixture: ComponentFixture<SuperAdminLoadItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminLoadItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminLoadItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
