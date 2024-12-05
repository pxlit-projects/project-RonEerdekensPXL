import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectPostDialogComponent } from './reject-post-dialog.component';

describe('RejectPostDialogComponent', () => {
  let component: RejectPostDialogComponent;
  let fixture: ComponentFixture<RejectPostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectPostDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
