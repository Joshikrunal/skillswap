import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformService } from '../../core/services/platform.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { PlatformStats } from '../../shared/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent],
  template: `
    <section class="hero card">
      <div>
        <span class="badge">Angular + Official REST API</span>
        <h1>Freelance marketplace UI built for the complete SkillSwap flow.</h1>
        <p>
          Register, log in, post jobs, send proposals, accept work, complete jobs,
          and leave reviews with a clean frontend connected to the official API.
        </p>
        <div class="hero-actions">
          <a routerLink="/jobs" class="btn">Explore Jobs</a>
          @if (!auth.isLoggedIn()) {
            <a routerLink="/register" class="btn btn-secondary">Create Account</a>
          } @else {
            <a routerLink="/jobs/create" class="btn btn-secondary">Post a Job</a>
          }
        </div>
      </div>
    </section>

    @if (loading) {
      <app-loading-spinner />
    } @else if (stats) {
      <section class="stats-grid mt-24">
        <div class="card stat-card">
          <h3>Total Users</h3>
          <p>{{ stats.total_users }}</p>
        </div>
        <div class="card stat-card">
          <h3>Active Jobs</h3>
          <p>{{ stats.active_jobs }}</p>
        </div>
        <div class="card stat-card">
          <h3>Total Value Moved</h3>
          <p>\${{ stats.total_value_moved }}</p>
        </div>
      </section>
    }

    <section class="card mt-24">
      <div class="section-head">
        <div>
          <h2 class="mb-8">Quick access</h2>
          <p class="muted">Useful pages for your midterm demo.</p>
        </div>
      </div>

      <div class="quick-grid mt-16">
        <a routerLink="/jobs" class="quick-link">
          <strong>Browse jobs</strong>
          <div class="muted mt-8">Search open jobs from the API.</div>
        </a>
        <a routerLink="/stats" class="quick-link">
          <strong>Platform stats</strong>
          <div class="muted mt-8">Public platform dashboard.</div>
        </a>
        <a routerLink="/jobs/create" class="quick-link">
          <strong>Create a job</strong>
          <div class="muted mt-8">Post work as a client.</div>
        </a>
        <a routerLink="/proposals/my-bids" class="quick-link">
          <strong>My proposals</strong>
          <div class="muted mt-8">Track pending and accepted bids.</div>
        </a>
      </div>
    </section>
  `
})
export class HomeComponent {
  private platformService = inject(PlatformService);
  readonly auth = inject(AuthService);

  stats: PlatformStats | null = null;
  loading = true;

  ngOnInit(): void {
    this.platformService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
