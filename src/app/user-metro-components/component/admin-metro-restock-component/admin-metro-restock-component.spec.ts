import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroRestockComponent } from './admin-metro-restock-component';

describe('AdminMetroRestockComponent', () => {
  let component: AdminMetroRestockComponent;
  let fixture: ComponentFixture<AdminMetroRestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroRestockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroRestockComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
