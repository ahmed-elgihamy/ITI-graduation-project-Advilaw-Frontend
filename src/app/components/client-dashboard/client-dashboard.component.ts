import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../dashboard/sidebar/sidebar.component';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css',
  imports: [RouterModule, SidebarComponent]
})
export class ClientDashboardComponent {
   links=document.querySelectorAll('#sidebarMenuOffcanvas .nav-link')
    closeNavbar():void{
       (document.querySelector(".offcanvas-header .btn-close") as HTMLButtonElement)?.click();
          
        }
        
      
}