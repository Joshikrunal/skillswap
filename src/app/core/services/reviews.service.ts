import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private http: HttpClient) {}

  createReview(jobId: number, payload: { target_id: number; rating: number; comment?: string }): Observable<Review> {
    return this.http.post<Review>(`${environment.apiBaseUrl}/jobs/${jobId}/reviews`, payload);
  }

  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiBaseUrl}/reviews/user/${userId}`);
  }
}
