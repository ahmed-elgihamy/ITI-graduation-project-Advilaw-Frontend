import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-lawyer-details',
  templateUrl: './lawyer-details.component.html',
  imports: [CommonModule, RouterModule]
})
export class LawyerDetailsComponent implements OnInit {
  lawyer: any;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    console.log('Lawyer ID from route:', id);
  
    if (id) {
      this.adminService.getLawyerById(id).subscribe({
        next: (data) => {
          this.lawyer = data;
        },
        error: (err) => {
          console.error('Error loading lawyer:', err);
        }
      });
    }
  }
  

  approveLawyer() {
    this.adminService.approveLawyer(this.lawyer.id).subscribe(() => {
      this.router.navigate(['/dashboard/admin-dashboard/pending-lawyers']);
    });
  }

  backToList() {
    this.router.navigate(['/dashboard/admin-dashboard/pending-lawyers']);
  }
}