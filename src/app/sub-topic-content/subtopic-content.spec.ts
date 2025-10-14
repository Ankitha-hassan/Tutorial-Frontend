import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtopicContent } from './subtopic-content';

describe('SubtopicContent', () => {
  let component: SubtopicContent;
  let fixture: ComponentFixture<SubtopicContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtopicContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtopicContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
