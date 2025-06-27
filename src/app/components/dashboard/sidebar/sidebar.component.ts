import { CommonModule, NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItemComponent } from '../tools/nav-item/nav-item.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgStyle, CommonModule, NavItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isOpendsidebar = signal(true);

  toggleSidebar() {
    this.isOpendsidebar.set(!this.isOpendsidebar());
  }
  
}