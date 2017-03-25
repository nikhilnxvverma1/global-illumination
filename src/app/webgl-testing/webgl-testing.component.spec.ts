/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WebglTestingComponent } from './webgl-testing.component';

describe('WebglTestingComponent', () => {
  let component: WebglTestingComponent;
  let fixture: ComponentFixture<WebglTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebglTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebglTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
