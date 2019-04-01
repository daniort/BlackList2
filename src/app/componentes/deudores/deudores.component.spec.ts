import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeudoresComponent } from './deudores.component';

describe('DeudoresComponent', () => {
  let component: DeudoresComponent;
  let fixture: ComponentFixture<DeudoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeudoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeudoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
