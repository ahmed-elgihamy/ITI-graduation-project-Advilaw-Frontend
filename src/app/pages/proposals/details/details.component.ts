import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProposalDetailsDTO,
  ProposalStatus,
} from '../../../types/Proposals/ProposalDetailsDTO';
import { ProposalService } from '../../../core/services/proposal.service';
import { ApiResponse } from '../../../types/ApiResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './details.component.html',
  imports: [CommonModule],
})
export class ProposalDetailsComponent implements OnInit {
  proposal!: ProposalDetailsDTO;
  proposalStatusEnum = ProposalStatus;
  isClient = false;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const proposalId = Number(this.route.snapshot.paramMap.get('id'));
    if (!proposalId) {
      this.errorMessage = 'Invalid proposal ID.';
      this.isLoading = false;
      return;
    }

    this.proposalService.GetProposal(proposalId).subscribe({
      next: (response: ApiResponse<ProposalDetailsDTO>) => {
        if (response.succeeded && response.data) {
          this.proposal = response.data;
          this.isClient = this.proposalService.Role === 'Client';
        } else {
          this.errorMessage = response.message ?? 'Proposal not found.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error fetching proposal details.';
        this.isLoading = false;
      },
    });
  }

  getStatusLabel(status: ProposalStatus): string {
    switch (status) {
      case ProposalStatus.Accepted:
        return 'Accepted';
      case ProposalStatus.Rejected:
        return 'Rejected';
      default:
        return 'Pending';
    }
  }

  acceptProposal(): void {
    console.log(`Accepting proposal #${this.proposal.id}`);
    this.proposalService.AcceptProposal(this.proposal.id).subscribe({
      next: (response: ApiResponse<ProposalDetailsDTO>) => {
        if (response.succeeded && response.data) {
          this.proposal = response.data;
          // console.log(response.data);
          this.router.navigate(['/jobs']);
        } else {
          this.errorMessage = response.message ?? 'Error accepting proposal.';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.message ?? 'Error accepting proposal.';
      },
    });
  }

  rejectProposal(): void {
    console.log(`Rejecting proposal #${this.proposal.id}`);
    this.proposalService.RejectProposal(this.proposal.id).subscribe({
      next: (response: ApiResponse<ProposalDetailsDTO>) => {
        if (response.succeeded && response.data) {
          this.proposal = response.data;
        } else {
          this.errorMessage = response.message ?? 'Error rejecting proposal.';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.message ?? 'Error rejecting proposal.';
      },
    });
  }
}
