import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminAddNewItemComponent } from './super-admin-add-new-item-component';

describe('SuperAdminAddNewItemComponent', () => {
  let component: SuperAdminAddNewItemComponent;
  let fixture: ComponentFixture<SuperAdminAddNewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminAddNewItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminAddNewItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
