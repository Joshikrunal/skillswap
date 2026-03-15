import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <div class="container nav-inner">
        <a class="brand" routerLink="/">SkillSwap</a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/jobs" routerLinkActive="active">Jobs</a>
          <a routerLink="/stats" routerLinkActive="active">Stats</a>

          @if (isLoggedIn()) {
            <a routerLink="/jobs/create" routerLinkActive="active">Post Job</a>
            <a routerLink="/jobs/my-postings" routerLinkActive="active">My Postings</a>
            <a routerLink="/proposals/my-bids" routerLinkActive="active">My Bids</a>
            <a routerLink="/me" routerLinkActive="active">Profile</a>
            <button class="btn btn-danger" type="button" (click)="logout()">Logout</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private auth = inject(AuthService);
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());

  logout(): void {
    this.auth.logout();
  }
}
