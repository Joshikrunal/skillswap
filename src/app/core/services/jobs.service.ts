import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class JobsService {
  constructor(private http: HttpClient) {}

  searchJobs(filters: { category?: string; status?: string; min_budget?: number | null }): Observable<Job[]> {
    return this.http.post<Job[]>(`${environment.apiBaseUrl}/jobs/search`, filters);
  }

  createJob(payload: { title: string; description: string; budget: number; category: string }): Observable<Job> {
    return this.http.post<Job>(`${environment.apiBaseUrl}/jobs`, payload);
  }

  getJobById(jobId: string | number): Observable<Job> {
    return this.http.get<Job>(`${environment.apiBaseUrl}/jobs/${jobId}`);
  }

  updateJob(jobId: string | number, payload: Partial<Job>): Observable<Job> {
    return this.http.patch<Job>(`${environment.apiBaseUrl}/jobs/${jobId}`, payload);
  }

  getMyPostings(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiBaseUrl}/jobs/my-postings`);
  }

  completeJob(jobId: string | number): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/jobs/${jobId}/complete`, {});
  }
}