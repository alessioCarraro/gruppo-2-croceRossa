import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminAddExistingItem } from './super-admin-add-existing-item';

describe('SuperAdminAddExistingItem', () => {
  let component: SuperAdminAddExistingItem;
  let fixture: ComponentFixture<SuperAdminAddExistingItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminAddExistingItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminAddExistingItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
