import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsbyidComponent } from './newsbyid.component';

describe('NewsbyidComponent', () => {
  let component: NewsbyidComponent;
  let fixture: ComponentFixture<NewsbyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsbyidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsbyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
