import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroLoadItemComponent } from './admin-metro-load-item-component';

describe('AdminMetroLoadItemComponent', () => {
  let component: AdminMetroLoadItemComponent;
  let fixture: ComponentFixture<AdminMetroLoadItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroLoadItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroLoadItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
