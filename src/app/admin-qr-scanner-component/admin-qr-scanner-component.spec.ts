import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminQrScannerComponent } from './admin-qr-scanner-component';

describe('AdminQrScannerComponent', () => {
  let component: AdminQrScannerComponent;
  let fixture: ComponentFixture<AdminQrScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQrScannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminQrScannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
