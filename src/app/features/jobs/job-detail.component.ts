import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobsService } from '../../core/services/jobs.service';
import { ProposalsService } from '../../core/services/proposals.service';
import { ReviewsService } from '../../core/services/reviews.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Job, Proposal } from '../../shared/models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    @if (loading) {
      <div class="card">
        <h3>Loading job details...</h3>
      </div>
    } @else if (errorMessage) {
      <div class="card">
        <div class="alert error">{{ errorMessage }}</div>
      </div>
    } @else if (job) {
      <div class="card">
        <div class="job-card-top">
          <span class="badge">{{ job!.category }}</span>
          <span class="status" [class]="'status ' + job!.status">
            {{ job!.status }}
          </span>
        </div>

        <h2 class="mt-16">{{ job!.title }}</h2>
        <p class="muted">{{ job!.description }}</p>

        <div class="job-meta">
          <span>Budget: \${{ job!.budget }}</span>
          <span>Job ID: {{ job!.id }}</span>
        </div>

        @if (job!.owner?.username; as ownerUsername) {
          <p class="mt-8">
            Posted by:
            <a [routerLink]="['/users', ownerUsername]" style="color:#93c5fd">
              &#64;{{ ownerUsername }}
            </a>
          </p>
        }

        @if (job!.freelancer?.username; as freelancerUsername) {
          <p class="mt-8">
            Assigned freelancer:
            <a [routerLink]="['/users', freelancerUsername]" style="color:#93c5fd">
              &#64;{{ freelancerUsername }}
            </a>
          </p>
        }

        <div class="hero-actions mt-20">
          @if (isOwner && job!.status === 'open') {
            <button class="btn" type="button" (click)="loadProposals()">
              View Proposals
            </button>
          }

          @if ((isOwner || isAssignedFreelancer) && job!.status === 'in_progress') {
            <button class="btn" type="button" (click)="completeJob()">
              Mark as Completed
            </button>
          }
        </div>

        @if (!isOwner && job!.status === 'open' && isLoggedIn) {
          <form class="card mt-24" [formGroup]="proposalForm" (ngSubmit)="submitProposal()">
            <h3>Submit Proposal</h3>

            <label>Price</label>
            <input type="number" formControlName="price" />

            <label>Cover Letter</label>
            <textarea rows="4" formControlName="cover_letter"></textarea>

            <button class="btn mt-16" [disabled]="proposalForm.invalid">
              Submit Proposal
            </button>
          </form>
        }

        @if (proposals.length) {
          <div class="mt-24">
            <h3>Proposals</h3>

            @for (proposal of proposals; track proposal.id) {
              <div class="card proposal-card mb-16">
                <p><strong>Freelancer:</strong> {{ proposal.freelancer?.name || 'User' }}</p>
                <p><strong>Price:</strong> \${{ proposal.price }}</p>
                <p>{{ proposal.cover_letter || proposal.message || 'No message' }}</p>
                <p><strong>Status:</strong> {{ proposal.status }}</p>

                @if (isOwner && proposal.status === 'pending' && job!.status === 'open') {
                  <button class="btn mt-12" type="button" (click)="acceptProposal(proposal.id)">
                    Accept Proposal
                  </button>
                }
              </div>
            }
          </div>
        }

        @if (job!.status === 'completed' && isLoggedIn && reviewTargetId) {
          <form class="card mt-24" [formGroup]="reviewForm" (ngSubmit)="submitReview()">
            <h3>Leave Review</h3>

            <label>Rating</label>
            <select formControlName="rating">
              <option [value]="1">1</option>
              <option [value]="2">2</option>
              <option [value]="3">3</option>
              <option [value]="4">4</option>
              <option [value]="5">5</option>
            </select>

            <label>Comment</label>
            <textarea rows="4" formControlName="comment"></textarea>

            <button class="btn mt-16" [disabled]="reviewForm.invalid">
              Submit Review
            </button>
          </form>
        }
      </div>
    } @else {
      <div class="card">
        <div class="alert error">Job not found.</div>
      </div>
    }
  `
})
export class JobDetailComponent {
  private route = inject(ActivatedRoute);
  private jobsService = inject(JobsService);
  private proposalsService = inject(ProposalsService);
  private reviewsService = inject(ReviewsService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  job: Job | null = null;
  proposals: Proposal[] = [];
  errorMessage = '';
  loading = true;
  isOwner = false;
  isAssignedFreelancer = false;
  isLoggedIn = false;
  reviewTargetId: number | null = null;

  readonly proposalForm = this.fb.nonNullable.group({
    price: [0, [Validators.required, Validators.min(1)]],
    cover_letter: ['', Validators.required]
  });

  readonly reviewForm = this.fb.nonNullable.group({
    rating: [5, Validators.required],
    comment: ['']
  });

  ngOnInit(): void {
    this.isLoggedIn = !!this.auth.getToken();
    this.loadJob();
  }

  loadJob(): void {
    this.loading = true;
    this.errorMessage = '';

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === 'null' || idParam === 'undefined') {
      this.errorMessage = 'Invalid job ID.';
      this.loading = false;
      return;
    }

    this.jobsService.getJobById(idParam).subscribe({
      next: (res) => {
        this.job = res;
        const me = this.auth.userSignal();

        this.isOwner = !!(me && (res.owner?.username === me.username || res.owner_id === me.id));
        this.isAssignedFreelancer = !!(me && res.freelancer_id === me.id);

        if (me && res.status === 'completed') {
          if (this.isOwner && res.freelancer_id) {
            this.reviewTargetId = res.freelancer_id;
          } else if (this.isAssignedFreelancer && (res.owner_id || res.owner?.id)) {
            this.reviewTargetId = res.owner_id || res.owner?.id || null;
          }
        }

        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Job not found';
        this.loading = false;
      }
    });
  }

  loadProposals(): void {
    if (!this.job) return;

    this.proposalsService.getJobProposals(this.job.id).subscribe({
      next: (res) => {
        this.proposals = res;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Could not load proposals';
      }
    });
  }

  submitProposal(): void {
    if (!this.job || this.proposalForm.invalid) return;

    this.proposalsService.createProposal(this.job.id, this.proposalForm.getRawValue()).subscribe({
      next: () => {
        this.toast.show('Proposal submitted', 'success');
        this.proposalForm.reset({
          price: 0,
          cover_letter: ''
        });
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Could not submit proposal';
      }
    });
  }

  acceptProposal(proposalId: number): void {
    this.proposalsService.acceptProposal(proposalId).subscribe({
      next: () => {
        this.toast.show('Proposal accepted. Job moved to in_progress.', 'success');
        this.loadJob();
        this.loadProposals();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Could not accept proposal';
      }
    });
  }

  completeJob(): void {
    if (!this.job) return;

    this.jobsService.completeJob(this.job.id).subscribe({
      next: () => {
        this.toast.show('Job marked as completed', 'success');
        this.loadJob();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Could not complete job';
      }
    });
  }

  submitReview(): void {
    if (!this.job || this.reviewForm.invalid || !this.reviewTargetId) return;

    this.reviewsService.createReview(this.job.id, {
      target_id: this.reviewTargetId,
      rating: Number(this.reviewForm.value.rating),
      comment: this.reviewForm.value.comment || ''
    }).subscribe({
      next: () => {
        this.toast.show('Review submitted', 'success');
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Could not submit review';
      }
    });
  }
}