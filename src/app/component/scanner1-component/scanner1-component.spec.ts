import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrScannerComponent } from './scanner1-component';

describe('QrScannerComponent', () => {
  let component: QrScannerComponent;
  let fixture: ComponentFixture<QrScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrScannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QrScannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
