import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroAddExistingItemComponent } from './admin-metro-add-existing-item-component';

describe('AdminMetroAddExistingItemComponent', () => {
  let component: AdminMetroAddExistingItemComponent;
  let fixture: ComponentFixture<AdminMetroAddExistingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroAddExistingItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroAddExistingItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
