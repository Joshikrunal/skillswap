import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-me',
  standalone: true,
  template: `
    @if (auth.userSignal(); as me) {
      <div class="card profile-card">
        <span class="badge">My Profile</span>
        <h2>{{ me.name }}</h2>
        <p class="muted">&#64;{{ me.username }}</p>
        <p>{{ me.bio }}</p>

        <div class="dashboard-grid mt-24">
          <div class="card">
            <h3>Average Rating</h3>
            <p>{{ me.rating_avg || 0 }}</p>
          </div>
          <div class="card">
            <h3>Completed Jobs</h3>
            <p>{{ me.completed_jobs || 0 }}</p>
          </div>
        </div>

        <h3 class="mt-24">Skills</h3>
        <div class="chips mt-12">
          @for (skill of me.skills; track skill) {
            <span class="chip">{{ skill }}</span>
          }
        </div>
      </div>
    }
  `
})
export class MeComponent {
  readonly auth = inject(AuthService);
}