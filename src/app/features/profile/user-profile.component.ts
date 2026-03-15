import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { ReviewsService } from '../../core/services/reviews.service';
import { User, Review } from '../../shared/models';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    @if (user) {
      <div class="card profile-card">
        <span class="badge">Public Profile</span>
        <h2>{{ user.name }}</h2>
        <p class="muted">&#64;{{ user.username }}</p>
        <p>{{ user.bio }}</p>

        <div class="dashboard-grid mt-24">
          <div class="card">
            <h3>Average Rating</h3>
            <p>{{ user.rating_avg || 0 }}</p>
          </div>
          <div class="card">
            <h3>Completed Jobs</h3>
            <p>{{ user.completed_jobs || 0 }}</p>
          </div>
        </div>

        <h3 class="mt-24">Skills</h3>
        <div class="chips mt-12">
          @for (skill of user.skills; track skill) {
            <span class="chip">{{ skill }}</span>
          }
        </div>
      </div>

      <div class="mt-24">
        <h3>User Reviews</h3>
        @if (!reviews.length) {
          <div class="card empty-state">
            <p>No reviews yet.</p>
          </div>
        } @else {
          @for (review of reviews; track review.id) {
            <div class="card review-card mb-16">
              <strong>{{ review.rating }}/5</strong>
              <p class="mt-8">{{ review.comment || 'No comment provided.' }}</p>
            </div>
          }
        }
      </div>
    }
  `
})
export class UserProfileComponent {
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private reviewsService = inject(ReviewsService);

  user: User | null = null;
  reviews: Review[] = [];

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.usersService.getUserByUsername(username).subscribe({
      next: (res) => {
        this.user = res;
        this.reviewsService.getReviewsByUser(res.id).subscribe({
          next: (reviews) => this.reviews = reviews
        });
      }
    });
  }
}