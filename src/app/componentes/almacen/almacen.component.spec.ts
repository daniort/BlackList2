import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenComponent } from './almacen.component';

describe('AlmacenComponent', () => {
  let component: AlmacenComponent;
  let fixture: ComponentFixture<AlmacenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlmacenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
