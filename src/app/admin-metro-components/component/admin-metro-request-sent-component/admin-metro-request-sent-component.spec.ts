import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMetroRequestSentComponent } from './admin-metro-request-sent-component';

describe('AdminMetroRequestSentComponent', () => {
  let component: AdminMetroRequestSentComponent;
  let fixture: ComponentFixture<AdminMetroRequestSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMetroRequestSentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMetroRequestSentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
