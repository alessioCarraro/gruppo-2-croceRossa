import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminMetroStock } from './super-admin-metro-stock';

describe('SuperAdminMetroStock', () => {
  let component: SuperAdminMetroStock;
  let fixture: ComponentFixture<SuperAdminMetroStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminMetroStock],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminMetroStock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
