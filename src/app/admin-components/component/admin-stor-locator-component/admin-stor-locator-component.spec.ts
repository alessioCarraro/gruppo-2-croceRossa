import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStorLocatorComponent } from './admin-stor-locator-component';

describe('AdminStorLocatorComponent', () => {
  let component: AdminStorLocatorComponent;
  let fixture: ComponentFixture<AdminStorLocatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStorLocatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStorLocatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
