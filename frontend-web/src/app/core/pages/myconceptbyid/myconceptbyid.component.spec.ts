import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyconceptbyidComponent } from './myconceptbyid.component';

describe('MyconceptbyidComponent', () => {
  let component: MyconceptbyidComponent;
  let fixture: ComponentFixture<MyconceptbyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyconceptbyidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyconceptbyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
