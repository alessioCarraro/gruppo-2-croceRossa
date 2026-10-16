import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroAddNewItemComponent } from './admin-metro-add-new-item-component';

describe('AdminMetroAddNewItemComponent', () => {
  let component: AdminMetroAddNewItemComponent;
  let fixture: ComponentFixture<AdminMetroAddNewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroAddNewItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroAddNewItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
