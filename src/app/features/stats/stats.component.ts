import { Component, inject } from '@angular/core';
import { PlatformService } from '../../core/services/platform.service';
import { PlatformStats } from '../../shared/models';

@Component({
  selector: 'app-stats',
  standalone: true,
  template: `
    <div class="section-head">
      <div>
        <h2 class="mb-8">Platform Statistics</h2>
        <p class="muted">Public numbers returned by the official API.</p>
      </div>
    </div>

    @if (stats) {
      <div class="stats-grid mt-24">
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
      </div>
    }
  `
})
export class StatsComponent {
  private platformService = inject(PlatformService);
  stats: PlatformStats | null = null;

  ngOnInit(): void {
    this.platformService.getStats().subscribe({
      next: (res) => this.stats = res
    });
  }
}
