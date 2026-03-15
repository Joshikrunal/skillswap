import { Component, inject } from '@angular/core';
import { ProposalsService } from '../../core/services/proposals.service';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { ToastService } from '../../core/services/toast.service';
import { Proposal } from '../../shared/models';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <div class="section-head">
      <div>
        <h2 class="mb-8">My Bids</h2>
        <p class="muted">All proposals submitted by your account.</p>
      </div>
    </div>

    @if (!bids.length) {
      <app-empty-state title="No proposals yet" message="Submit a proposal to a job first." />
    } @else {
      <div class="job-grid mt-24">
        @for (bid of bids; track bid.id) {
          <div class="card proposal-card">
            <h3>Proposal #{{ bid.id }}</h3>
            <p>{{ bid.cover_letter || bid.message || 'No message' }}</p>
            <div class="job-meta">
              <span>Price: \${{ bid.price }}</span>
              <span>Status: {{ bid.status }}</span>
            </div>
            @if (bid.status === 'pending') {
              <button class="btn btn-danger w-full" type="button" (click)="withdraw(bid.id)">Withdraw</button>
            }
          </div>
        }
      </div>
    }
  `
})
export class MyBidsComponent {
  private proposalsService = inject(ProposalsService);
  private toast = inject(ToastService);

  bids: Proposal[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.proposalsService.getMyBids().subscribe({
      next: (res) => this.bids = res
    });
  }

  withdraw(id: number): void {
    this.proposalsService.deleteProposal(id).subscribe({
      next: () => {
        this.toast.show('Proposal withdrawn', 'success');
        this.load();
      }
    });
  }
}
