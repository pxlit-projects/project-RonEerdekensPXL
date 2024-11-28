import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysubmittedpostsComponent } from './mysubmittedposts.component';

describe('MysubmittedpostsComponent', () => {
  let component: MysubmittedpostsComponent;
  let fixture: ComponentFixture<MysubmittedpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysubmittedpostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysubmittedpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
