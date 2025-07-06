import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageInpuComponent } from './message-inpu.component';

describe('MessageInpuComponent', () => {
  let component: MessageInpuComponent;
  let fixture: ComponentFixture<MessageInpuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageInpuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageInpuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
