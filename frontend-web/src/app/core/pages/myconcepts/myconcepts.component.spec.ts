import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyconceptsComponent } from './myconcepts.component';

describe('MyconceptsComponent', () => {
  let component: MyconceptsComponent;
  let fixture: ComponentFixture<MyconceptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyconceptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyconceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
