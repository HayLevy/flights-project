import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationCreateComponent } from './destination-create.component';

describe('DestinationCreateComponent', () => {
  let component: DestinationCreateComponent;
  let fixture: ComponentFixture<DestinationCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
