import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonProfileNotoken } from './person-profile-notoken';

describe('PersonProfileNotoken', () => {
  let component: PersonProfileNotoken;
  let fixture: ComponentFixture<PersonProfileNotoken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonProfileNotoken],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonProfileNotoken);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
