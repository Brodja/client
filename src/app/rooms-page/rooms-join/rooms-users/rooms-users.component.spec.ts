import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsUsersComponent } from './rooms-users.component';

describe('RoomsUsersComponent', () => {
  let component: RoomsUsersComponent;
  let fixture: ComponentFixture<RoomsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomsUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
