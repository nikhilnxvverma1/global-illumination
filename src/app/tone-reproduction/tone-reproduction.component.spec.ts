/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToneReproductionComponent } from './tone-reproduction.component';

describe('ToneReproductionComponent', () => {
  let component: ToneReproductionComponent;
  let fixture: ComponentFixture<ToneReproductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToneReproductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToneReproductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
