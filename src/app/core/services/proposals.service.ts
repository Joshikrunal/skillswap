import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Proposal } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProposalsService {
  constructor(private http: HttpClient) {}

  createProposal(jobId: number, payload: { price: number; cover_letter: string }): Observable<Proposal> {
    return this.http.post<Proposal>(`${environment.apiBaseUrl}/jobs/${jobId}/proposals`, payload);
  }

  getJobProposals(jobId: number): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${environment.apiBaseUrl}/jobs/${jobId}/proposals`);
  }

  acceptProposal(proposalId: number): Observable<unknown> {
    return this.http.patch(`${environment.apiBaseUrl}/proposals/${proposalId}/accept`, {});
  }

  getMyBids(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${environment.apiBaseUrl}/proposals/my-bids`);
  }

  deleteProposal(proposalId: number): Observable<unknown> {
    return this.http.delete(`${environment.apiBaseUrl}/proposals/${proposalId}`);
  }
}
