import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovingpostsComponent } from './approvingposts.component';

describe('ApprovingpostsComponent', () => {
  let component: ApprovingpostsComponent;
  let fixture: ComponentFixture<ApprovingpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovingpostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovingpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
