import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-slot',
  templateUrl: './time-slot.component.html',
  styleUrls: ['./time-slot.component.css'],
  imports: [CommonModule],
})
export class TimeSlotComponent {
  @Input() day!: string;
  @Input() hour!: number;
  @Input() isFree!: boolean;
  @Input() isSelected!: boolean;
  @Input() formatHour!: (hour: number) => string;
  @Input() onClick!: () => void;

  // Utility function to handle dynamic classnames
  get containerClasses(): string[] {
    const base = [
      'h-12',
      'rounded-lg',
      'border-2',
      'cursor-pointer',
      'transition-all',
      'duration-300',
      'hover:scale-105',
      'hover:shadow-md',
      'flex',
      'items-center',
      'justify-center',
      'text-xs',
      'font-medium',
      'relative',
      'overflow-hidden',
    ];

    const state = this.isFree
      ? [
          'bg-schedule-free/20',
          'border-schedule-free/30',
          'hover:bg-schedule-free/30',
          'text-schedule-free',
        ]
      : [
          'bg-schedule-busy/20',
          'border-schedule-busy/30',
          'hover:bg-schedule-busy/30',
          'text-schedule-busy',
        ];

    const selected = this.isSelected
      ? [
          'ring-2',
          'ring-accent-gold',
          'ring-offset-2',
          'scale-105',
          'shadow-lg',
        ]
      : [];

    return [...base, ...state, ...selected];
  }

  get gradientOverlayClasses(): string[] {
    return [
      'absolute',
      'inset-0',
      'opacity-0',
      'hover:opacity-20',
      'transition-opacity',
      'duration-300',
      ...(this.isFree
        ? ['bg-gradient-to-br', 'from-schedule-free', 'to-schedule-free-light']
        : ['bg-gradient-to-br', 'from-schedule-busy', 'to-red-400']),
    ];
  }

  get statusIndicatorClasses(): string[] {
    return [
      'absolute',
      'top-1',
      'right-1',
      'w-2',
      'h-2',
      'rounded-full',
      this.isFree ? 'bg-schedule-free' : 'bg-schedule-busy',
    ];
  }
}
