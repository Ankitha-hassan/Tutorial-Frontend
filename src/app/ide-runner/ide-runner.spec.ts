import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeRunnerComponent } from './ide-runner';

describe('IdeRunner', () => {
  let component: IdeRunnerComponent;
  let fixture: ComponentFixture<IdeRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeRunnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
