import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonProfileComponent } from './person-profile-component';

describe('PersonProfileComponent', () => {
  let component: PersonProfileComponent;
  let fixture: ComponentFixture<PersonProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
