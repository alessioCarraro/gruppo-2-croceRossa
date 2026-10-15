import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalWarehouseComponent } from './local-warehouse-component';

describe('LocalWarehouseComponent', () => {
  let component: LocalWarehouseComponent;
  let fixture: ComponentFixture<LocalWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalWarehouseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalWarehouseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
