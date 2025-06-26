import { CommonModule, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-item',
  imports: [NgStyle, CommonModule, RouterLink],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css',
})
export class NavItemComponent {
  @Input() iconClass!: string;
  @Input() name!: string;
  @Input() toLink!: string;
  @Input() isOpendsidebar!: boolean;
}
