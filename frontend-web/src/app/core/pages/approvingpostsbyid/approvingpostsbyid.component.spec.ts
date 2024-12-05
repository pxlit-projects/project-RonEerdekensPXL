import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovingpostsbyidComponent } from './approvingpostsbyid.component';

describe('ApprovingpostsbyidComponent', () => {
  let component: ApprovingpostsbyidComponent;
  let fixture: ComponentFixture<ApprovingpostsbyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovingpostsbyidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovingpostsbyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
