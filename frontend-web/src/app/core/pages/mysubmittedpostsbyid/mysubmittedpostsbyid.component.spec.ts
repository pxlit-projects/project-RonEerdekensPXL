import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysubmittedpostsbyidComponent } from './mysubmittedpostsbyid.component';

describe('MysubmittedpostsbyidComponent', () => {
  let component: MysubmittedpostsbyidComponent;
  let fixture: ComponentFixture<MysubmittedpostsbyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysubmittedpostsbyidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysubmittedpostsbyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
