import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownTimerComponentComponent } from './countdown-timer-component.component';

describe('CountdownTimerComponentComponent', () => {
  let component: CountdownTimerComponentComponent;
  let fixture: ComponentFixture<CountdownTimerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownTimerComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountdownTimerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
