import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlatformStats } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<PlatformStats> {
    return this.http.get<PlatformStats>(`${environment.apiBaseUrl}/platform/stats`);
  }
}
