import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonProfileNotokenComponent } from './person-profile-notoken';

describe('PersonProfileNotoken', () => {
  let component: PersonProfileNotokenComponent;
  let fixture: ComponentFixture<PersonProfileNotokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonProfileNotokenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonProfileNotokenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
