import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobsService } from '../../core/services/jobs.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="page-header">
      <h2>Explore Jobs</h2>
      <p class="muted">Browse live jobs from the API and open full details.</p>
    </div>

    <div class="card filters-grid">
      <input [(ngModel)]="filters.category" placeholder="Category" />

      <select [(ngModel)]="filters.status">
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <input type="number" [(ngModel)]="filters.min_budget" placeholder="Minimum budget" />

      <button class="btn" type="button" (click)="loadJobs()">Search</button>
    </div>

    @if (loading) {
      <app-loading-spinner />
    } @else if (!jobs.length) {
      <app-empty-state
        title="No jobs found"
        message="Try changing your filters to see more results."
      />
    } @else {
      <div class="job-grid mt-24">
        @for (job of jobs; track trackByJob(job)) {
          <div class="card job-card">
            <div class="job-card-top">
              <span class="badge">{{ job.category || 'General' }}</span>
              <span class="status" [class]="'status ' + (job.status || 'open')">
                {{ job.status || 'open' }}
              </span>
            </div>

            <h3>{{ job.title }}</h3>

            <p>
              {{ (job.description || 'No description available').length > 120
                ? (job.description | slice:0:120) + '...'
                : (job.description || 'No description available') }}
            </p>

            <div class="job-meta">
              <span class="job-budget">\${{ job.budget || 0 }}</span>
              <span class="job-id">Job #{{ getJobId(job) }}</span>
            </div>

            @if (getJobId(job)) {
              <a class="btn btn-secondary w-full" [routerLink]="['/jobs', getJobId(job)]">
                View Details
              </a>
            } @else {
              <button class="btn btn-secondary w-full" type="button" disabled>
                Job ID Missing
              </button>
            }
          </div>
        }
      </div>
    }
  `
})
export class JobsListComponent {
  private jobsService = inject(JobsService);

  jobs: any[] = [];
  loading = true;

  filters: {
    category: string;
    status: string;
    min_budget: number | null;
  } = {
    category: '',
    status: 'open',
    min_budget: null
  };

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;

    const payload: any = {
      status: this.filters.status || 'open'
    };

    if (this.filters.category.trim()) {
      payload.category = this.filters.category.trim();
    }

    if (
      this.filters.min_budget !== null &&
      this.filters.min_budget !== undefined &&
      this.filters.min_budget !== 0
    ) {
      payload.min_budget = Number(this.filters.min_budget);
    }

    this.jobsService.searchJobs(payload).subscribe({
      next: (res: any) => {
        const rawJobs = Array.isArray(res) ? res : [];

        this.jobs = rawJobs.map((job: any) => ({
          ...job,
          id: job?.id ?? job?.job_id ?? job?._id ?? null
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Jobs API error:', err);
        this.jobs = [];
        this.loading = false;
      }
    });
  }

  getJobId(job: any): number | string | null {
    return job?.id ?? job?.job_id ?? job?._id ?? null;
  }

  trackByJob(job: any): number | string {
    return this.getJobId(job) ?? Math.random();
  }
}