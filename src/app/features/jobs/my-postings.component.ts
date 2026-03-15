import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsService } from '../../core/services/jobs.service';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { Job } from '../../shared/models';

@Component({
  selector: 'app-my-postings',
  standalone: true,
  imports: [RouterLink, EmptyStateComponent],
  template: `
    <div class="section-head">
      <div>
        <h2 class="mb-8">My Posted Jobs</h2>
        <p class="muted">Manage the jobs you created.</p>
      </div>
      <a class="btn btn-secondary" routerLink="/jobs/create">Create New Job</a>
    </div>

    @if (!jobs.length) {
      <app-empty-state title="No jobs yet" message="Create your first job posting." />
    } @else {
      <div class="job-grid mt-24">
        @for (job of jobs; track job.id) {
          <div class="card job-card">
            <div class="job-card-top">
              <span class="badge">{{ job.category }}</span>
              <span class="status" [class]=" 'status ' + job.status ">{{ job.status }}</span>
            </div>
            <h3>{{ job.title }}</h3>
            <p>{{ job.description }}</p>
            <div class="job-meta">
              <span>\${{ job.budget }}</span>
              <span>Job #{{ job.id }}</span>
            </div>
            <a class="btn btn-secondary w-full" [routerLink]="['/jobs', job.id]">Manage Job</a>
          </div>
        }
      </div>
    }
  `
})
export class MyPostingsComponent {
  private jobsService = inject(JobsService);
  jobs: Job[] = [];

  ngOnInit(): void {
    this.jobsService.getMyPostings().subscribe({
      next: (res) => this.jobs = res
    });
  }
}
